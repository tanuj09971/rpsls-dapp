"use client";
import { useEffect, useState } from "react";
import Web3 from "web3";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import CreateGame from "./CreateGame";
import { rpsBytecode } from "@/contracts/RPSBytecode";
import JoinGame from "./JoinGame";
import CalculateResult from "./CalculateResult";
import { moves } from "@/utils/constants";

enum Modes {
  NONE = "none",
  CREATE = "create-game",
  JOIN = "join-game",
  CALCULATE = "calculate-result",
}

const RPSGame: React.FC<{
  rpsAbi: any;
  hasherAddress: string;
  hasherAbi: any;
  account: string | null;
  joinValue: string | null;
  idValue: string | null;
  resultValue: string | null;
  result: any;
}> = ({
  rpsAbi,
  hasherAddress,
  hasherAbi,
  account,
  joinValue,
  idValue,
  resultValue,
  result,
}) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [rpsContract, setRpsContract] = useState<any | null>(null);
  const [hasherContract, setHasherContract] = useState<any | null>(null);
  const [currMode, setCurrMode] = useState<Modes>(
    joinValue ? Modes.JOIN : resultValue ? Modes.CALCULATE : Modes.NONE
  );
  const [hash, setHash] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [player1Move, setPlayer1Move] = useState<number>(0);
  const [played, setPlayed] = useState<boolean>(false);

  const initializeWeb3 = async () => {
    if ((window as any).ethereum) {
      const newWeb3 = new Web3((window as any).ethereum); // Type assertion
      setWeb3(newWeb3);
      const newHasherContract = new newWeb3.eth.Contract(
        hasherAbi,
        hasherAddress
      );
      setHasherContract(newHasherContract);
    }
  };

  useEffect(() => {
    if (joinValue || resultValue) {
      initializeWeb3();
    }
  }, [joinValue, idValue, resultValue]);

  const generateHash = async (move: number, salt: number | null) => {
    if (hasherContract) {
      try {
        const hashResult = await hasherContract.methods
          .hash(move, salt)
          .call({ from: account, gas: 500000 });
        setHash(hashResult);
      } catch (error) {
        console.error("Error generating the commitment hash:", error);
      }
    }
  };

  const deployRPSContract = async (
    c1HashValue: string,
    j2Address: string,
    stake: string | undefined
  ) => {
    if (web3) {
      try {
        const newRpsContract = new web3.eth.Contract(rpsAbi);
        const deployTransaction = newRpsContract.deploy({
          data: `0x${rpsBytecode}`,
          arguments: [c1HashValue, j2Address],
        } as any);

        // const gas = await deployTransaction.estimateGas();
        // const gasPrice = await web3.eth.getGasPrice();
        deployTransaction
          .send({
            from: account ?? "",
            gas: "3000000",
            gasPrice: "3000000",
            value: stake,
          })
          .on("confirmation", (confirmationNumber: any) => {
            const deployedContractAddress =
              confirmationNumber?.receipt?.contractAddress;
            const constract = new web3.eth.Contract(
              rpsAbi,
              deployedContractAddress
            );
            setRpsContract(constract);
            setContractAddress(deployedContractAddress);
            return deployedContractAddress;
          });
      } catch (error) {
        console.error("Error deploying contract:", error);
      }
    }
    return "";
  };

  const handleCreateGame = async () => {
    setCurrMode(Modes.CREATE);
    initializeWeb3();
  };

  const handleJoinGame = async () => {
    setCurrMode(Modes.JOIN);
    initializeWeb3();
  };

  const handleCalculateResult = async () => {
    if (!rpsContract) {
      window.alert("Create a game first!");
      return;
    }
    setCurrMode(Modes.CALCULATE);
    initializeWeb3();
  };

  const play = async (move: number, stake: number) => {
    if (rpsContract) {
      try {
        const playRes = await rpsContract.methods
          .play(move)
          .send({ from: account, value: stake, gas: 500000 });
        console.log("Play successful! :>>", playRes);
        if (playRes) setPlayed(true);
      } catch (error) {
        console.error("Error joining game:", error);
      } finally {
        setPlayed(true);
      }
    }
  };

  const solve = async (usedSalt: number | null) => {
    if (rpsContract) {
      try {
        const stake = await rpsContract.methods.stake().call({ from: account });
        const solveRes = await rpsContract.methods
          .solve(player1Move, usedSalt)
          .send({ from: account, gas: 500000 });
        const player2Move = await rpsContract.methods
          .c2()
          .call({ from: account });
        const winner = await rpsContract.methods
          .win(player1Move, Number(player2Move))
          .call({ from: account });
        const p2Address = await rpsContract.methods
          .j2()
          .call({ from: account });
        console.log("Solve successful! :>>", solveRes);
        if (winner) {
          return {
            winner: "Player-1",
            p1Move: moves[player1Move - 1],
            p2Move: moves[Number(player2Move) - 1],
            p1Address: account,
            p2Address: p2Address,
            stake: Number(stake) * 2,
          };
        } else if (moves[player1Move - 1] === moves[Number(player2Move) - 1]) {
          console.log("Game Tied!");
          return {
            winner: "Tie",
            p1Move: moves[player1Move - 1],
            p2Move: moves[Number(player2Move) - 1],
            p1Address: account,
            p2Address: p2Address,
            stake: 0,
          };
        } else {
          console.log("Player 2 won!");
          return {
            winner: "Player-2",
            p1Move: moves[player1Move - 1],
            p2Move: moves[Number(player2Move) - 1],
            p1Address: account,
            p2Address: p2Address,
            stake: Number(stake) * 2,
          };
        }
      } catch (error) {
        console.error("Error solving:", error);
      }
    }
  };

  return (
    <Stack mx={2} sx={{ ...(currMode !== Modes.NONE && { width: "90%" }) }}>
      <Stack gap={1} direction={"row"}>
        <Button variant="contained" onClick={handleCreateGame}>
          Create Game
        </Button>
        <Button variant="contained" onClick={handleJoinGame}>
          Join Game
        </Button>
        <Button variant="contained" onClick={handleCalculateResult}>
          Calculate Result
        </Button>
      </Stack>
      <Stack
        sx={
          currMode !== Modes.NONE
            ? { minHeight: "650px", minWidth: "48vw" }
            : {}
        }
      >
        {currMode === Modes.CREATE && (
          <CreateGame
            web3={web3}
            generateHash={generateHash}
            hash={hash}
            deployRPSContract={deployRPSContract}
            contractAddress={contractAddress}
            player1Move={player1Move}
            setPlayer1Move={setPlayer1Move}
          />
        )}
        {currMode === Modes.JOIN && (
          <JoinGame
            web3={web3}
            setRpsContract={setRpsContract}
            account={account}
            play={play}
            idValue={resultValue ? "" : idValue}
            played={played}
            rpsContract={rpsContract}
          />
        )}
        {currMode === Modes.CALCULATE && (
          <CalculateResult
            solve={solve}
            idValue={idValue}
            result={result}
            rpsContract={rpsContract}
            account={account}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default RPSGame;
