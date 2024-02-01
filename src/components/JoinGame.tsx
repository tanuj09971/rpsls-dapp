import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import OptionCards from "./OptionCards";
import RPS_ABI from "@/contracts/RPS.abi.json";
import Loading from "./Loading";

interface JoinGameProps {
  web3: any;
  setRpsContract: any;
  account: string | null;
  play: (move: number, stake: number) => void;
  idValue: string | null;
  played: boolean;
}

const JoinGame = ({
  web3,
  setRpsContract,
  account,
  play,
  idValue,
  played,
}: JoinGameProps) => {
  const [move, setMove] = useState<number>(0);
  const [enteredContractAddress, setEnteredContractAddress] = useState("");
  const [stake, setStake] = useState<number | undefined>();
  const [timeLeft, setTimeLeft] = useState<number | string | undefined>();
  const [loading, setLoading] = useState(false);

  const findGame = async () => {
    const newRpsContract = new web3.eth.Contract(
      RPS_ABI,
      idValue || enteredContractAddress
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

  useEffect(() => {
    if (played) {
      setLoading(false);
    }
  }, [played]);

  return (
    <Stack gap={4} my={4}>
      {loading && <Loading />}
      <Typography variant="h5">Join Game</Typography>
      <>
        <Stack width={"40%"} gap={4} minWidth={"400px"}>
          <TextField
            value={idValue || enteredContractAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEnteredContractAddress(event.target.value)
            }
            label={"Enter contract address"}
          />
          <Button
            variant="contained"
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
            <OptionCards move={move} setMove={setMove} />
            <Stack width={"40%"} gap={4}>
              <Button
                disabled={played}
                variant="outlined"
                onClick={() => {
                  play(move, stake);
                  setLoading(true);
                }}
              >
                {played ? "Move Submitted" : "Submit your move"}
              </Button>
            </Stack>
          </Stack>
        )}
      </>
    </Stack>
  );
};

export default JoinGame;
