"use client";
import { useState } from "react";
import Web3 from "web3";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import CreateGame from "./CreateGame";
import { rpsBytecode } from "@/contracts/RPSBytecode";
import JoinGame from "./JoinGame";
import CalculateResult from "./CalculateResult";

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
}> = ({ rpsAbi, hasherAddress, hasherAbi, account }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [rpsContract, setRpsContract] = useState<any | null>(null);
  const [hasherContract, setHasherContract] = useState<any | null>(null);
  const [currMode, setCurrMode] = useState<Modes>(Modes.NONE);
  const [hash, setHash] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [player1Move, setPlayer1Move] = useState<number>(0);

  const initializeWeb3 = async () => {
    if ((window as any).ethereum) {
      const newWeb3 = new Web3((window as any).ethereum); // Type assertion
      setWeb3(newWeb3);
      const newHasherContract = new newWeb3.eth.Contract(
        hasherAbi,
        hasherAddress
      );
      setHasherContract(newHasherContract);
      console.log("newHasherContract :>> ", newHasherContract);
    }
  };

  const generateHash = async (move: number, salt: number | null) => {
    if (hasherContract) {
      try {
        const hashResult = await hasherContract.methods
          .hash(move, salt)
          .call({ from: account, gas: 500000 });
        setHash(hashResult);
        console.log("Hash Result:>>", hashResult);
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
        });

        // const gas = await deployTransaction.estimateGas();
        // const gasPrice = await web3.eth.getGasPrice();
        // console.log("gas, gasPrice :>> ", gas, gasPrice);
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
            console.log(
              "confirmationNumber, receipt :>> ",
              confirmationNumber?.receipt
            );
          });
      } catch (error) {
        console.error("Error deploying contract:", error);
      }
    }
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
    setCurrMode(Modes.CALCULATE);
    initializeWeb3();
  };

  const play = async (move: number, stake: number) => {
    console.log("rpsContract------------- :>> ", rpsContract);
    if (rpsContract) {
      try {
        console.log("2ndaccount :>> ", account);
        const playRes = await rpsContract.methods
          .play(move)
          .send({ from: account, value: stake, gas: 500000 });
        console.log("playRes :>> ", playRes);
      } catch (error) {
        console.error("Error joining game:", error);
      }
    }
  };

  const solve = async (usedSalt: number | null) => {
    console.log("rpsContract:>>", rpsContract);
    if (rpsContract) {
      try {
        console.log("1stAccount :>> ", account);
        const solveRes = await rpsContract.methods
          .solve(player1Move, usedSalt)
          .send({ from: account, gas: 500000 });
        const player2Move = await rpsContract.methods
          .c2()
          .call({ from: account });
        console.log("player2Move :>> ", player2Move);
        const winner = await rpsContract.methods
          .win(player1Move, player2Move)
          .call({ from: account });
        if (winner) {
          console.log(`You (player 1) won!`);
        } else {
          console.log("Player 2 won!");
        }
        console.log("Solve successful!");
        console.log("playRes :>> ", solveRes);
      } catch (error) {
        console.error("Error solving:", error);
      }
    }
  };

  return (
    <Stack>
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
      {currMode === Modes.CREATE && (
        <CreateGame
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
        />
      )}
      {currMode === Modes.CALCULATE && <CalculateResult solve={solve} />}
    </Stack>
  );
};

export default RPSGame;
