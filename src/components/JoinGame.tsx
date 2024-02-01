import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import OptionCards from "./OptionCards";
import RPS_ABI from "@/contracts/RPS.abi.json";
import Loading from "./Loading";
import { timeLeft } from "@/utils/timeLeft";

interface JoinGameProps {
  web3: any;
  setRpsContract: any;
  account: string | null;
  play: (move: number, stake: number) => void;
  idValue: string | null;
  played: boolean;
  rpsContract: any;
}

const JoinGame = ({
  web3,
  setRpsContract,
  account,
  play,
  idValue,
  played,
  rpsContract,
}: JoinGameProps) => {
  const [move, setMove] = useState<number>(0);
  const [enteredContractAddress, setEnteredContractAddress] = useState("");
  const [stake, setStake] = useState<number | undefined>();
  const [timeLeftInGame, setTimeLeftInGame] = useState<
    number | string | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [refunded, setRefunded] = useState(false);
  const [joined, setJoined] = useState(false);
  const [intervalId, setIntervalId] = useState<any>();

  const handlePlay = async () => {
    if (stake) {
      setLoading(true);
      await play(move, stake);
      if (intervalId) {
        clearInterval(intervalId);
        timeLeft(rpsContract, account, setTimeLeftInGame);
      }
      setJoined(true);
    }
  };

  const getP2Funds = async () => {
    const j1Out = await rpsContract.methods
      .j1Timeout()
      .send({ from: account, gas: 500000 });
    if (j1Out) {
      setRefunded(true);
    }
  };

  const recallStake = async () => {
    const stake = await rpsContract.methods.stake().call({ from: account });
    setStake(Number(stake));
  };

  useEffect(() => {
    if (timeLeftInGame === "0 (Timed out)") {
      recallStake();
    }
  }, [timeLeftInGame]);

  const findGame = async () => {
    const newRpsContract = new web3.eth.Contract(
      RPS_ABI,
      idValue || enteredContractAddress
    );
    setRpsContract(newRpsContract);
    const stake = await newRpsContract.methods.stake().call({ from: account });
    setStake(Number(stake));
    const intervalId = await timeLeft(
      newRpsContract,
      account,
      setTimeLeftInGame
    );
    setIntervalId(intervalId);
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
        {stake && timeLeftInGame && (
          <Stack gap={4}>
            <Typography>Staked funds in the game: {stake}</Typography>
            <Typography>Timeleft: {timeLeftInGame}</Typography>
            {timeLeftInGame === "0 (Timed out)" && stake !== 0 && joined && (
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <Typography>
                  {"Player 1 didn't calculated the result"}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={getP2Funds}
                  disabled={refunded}
                >
                  Get funds back
                </Button>
              </Stack>
            )}
            {refunded && (
              <Typography color="green" mt={-2}>
                Funds Refunded...
              </Typography>
            )}
            <OptionCards move={move} setMove={setMove} />
            <Stack width={"40%"} gap={4}>
              <Button disabled={played} variant="outlined" onClick={handlePlay}>
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
