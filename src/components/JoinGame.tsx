import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import OptionCards from "./OptionCards";
import RPS_ABI from "@/contracts/RPS.abi.json";

interface JoinGameProps {
  web3: any;
  setRpsContract: any;
  account: string | null;
  play: (move: number, stake: number) => void;
}

const JoinGame = ({ web3, setRpsContract, account, play }: JoinGameProps) => {
  const [move, setMove] = useState<number>(0);
  const [enteredContractAddress, setEnteredContractAddress] = useState("");
  const [stake, setStake] = useState<number | undefined>();
  const [timeLeft, setTimeLeft] = useState<number | string | undefined>();
  const findGame = async () => {
    const newRpsContract = new web3.eth.Contract(
      RPS_ABI,
      enteredContractAddress
    );
    setRpsContract(newRpsContract);
    console.log("newRpsContract :>> ", newRpsContract);
    const stake = await newRpsContract.methods.stake().call({ from: account });
    setStake(Number(stake));
    const lastAction = await newRpsContract.methods
      .lastAction()
      .call({ from: account });
    const timeout = await newRpsContract.methods
      .TIMEOUT()
      .call({ from: account });
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeLeft =
        Number(lastAction) + Number(timeout) - Math.floor(now / 1000);
      setTimeLeft(timeLeft > 0 ? `${timeLeft} seconds` : "0 (Timed out)");
      if (timeLeft < 0) clearInterval(intervalId);
    });
    console.log("stake :>> ", Number(stake));
  };
  return (
    <Stack gap={4} my={4}>
      <Typography variant="h5">Join Game</Typography>
      <>
        <Stack width={"40%"} gap={4}>
          <TextField
            value={enteredContractAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEnteredContractAddress(event.target.value)
            }
            label={"Enter contract address"}
          />
          <Button
            variant="outlined"
            onClick={() => {
              findGame();
            }}
          >
            Find Game
          </Button>
        </Stack>
        {stake && timeLeft && (
          <Stack gap={4}>
            <Typography>Staked funds in the game: {stake}</Typography>
            <Typography>Timeleft: {timeLeft}</Typography>
            <OptionCards setMove={setMove} />
            <Stack width={"40%"} gap={4}>
              <TextField
                disabled
                value={`Your move: ${move}`}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setMove(parseInt(event.target.value))
                }
              />
              <Button
                variant="outlined"
                onClick={() => {
                  play(move, stake);
                }}
              >
                Submit your move
              </Button>
            </Stack>
          </Stack>
        )}
      </>
    </Stack>
  );
};

export default JoinGame;
