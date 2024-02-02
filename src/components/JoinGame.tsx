import { Button, Stack, TextField, Typography } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OptionCards, Loading } from "@/components";
import isValidEthAddress from "@/utils/isValidEthAddress";
import { useTimeLeft } from "@/hooks/useTimeLeft";
import { GameState } from "@/libs/types";
import { GameTexts } from "@/utils/constants";
import contractInstance from "@/utils/getContractInstance";
import { RpsAbi } from "@/contracts/ABI";
import { setLocalStorageData } from "@/utils/localStorage";
import playGame from "@/services/playGame";

interface JoinGameProps {
  contractAddress: string;
  setContractAddress: Dispatch<SetStateAction<string>>;
  connectedAccount: string | undefined;
  gameId: string | null;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const JoinGame = ({
  contractAddress,
  setContractAddress,
  connectedAccount,
  gameId,
  gameState,
  setGameState,
}: JoinGameProps) => {
  const [move, setMove] = useState<number>(0);
  const [fetchedMove, setFetchedMove] = useState<number>(0);
  const [enteredGameId, setEnteredGameId] = useState("");
  const [stake, setStake] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [resetTimer, setResetTimer] = useState<boolean>(false);

  const contract = useMemo(() => {
    return contractInstance(RpsAbi, contractAddress);
  }, [contractAddress]);

  const { timeLeft, intervalIdRef } = useTimeLeft(
    contractAddress,
    connectedAccount,
    gameState,
    resetTimer,
    true
  );

  const handlePlayGame = async () => {
    if (stake) {
      setLoading(true);
      setGameState(GameState.JOINING);
      const res = await playGame(
        move,
        stake,
        contractAddress,
        connectedAccount
      );
      if (res) {
        setGameState(GameState.JOINED);
        if (intervalIdRef) {
          clearInterval(intervalIdRef.current);
        }
      }
      setResetTimer(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resetTimer) setResetTimer(false);
  }, [resetTimer]);

  const getP2Funds = async () => {
    try {
      setLoading(true);
      const gasEstimate = await contract.methods
        .j1Timeout()
        .estimateGas({ from: connectedAccount });
      const j1Out = await contract.methods
        .j1Timeout()
        .send({ from: connectedAccount, gas: gasEstimate.toString() });
      if (j1Out) {
        setGameState(GameState.FUNDS_RETURNED);
      }
    } catch (error) {
      console.error("Error calling getP2Funds method:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getP2Move = async () => {
    const c2 = await contract.methods.c2().call({ from: connectedAccount });
    setFetchedMove(Number(c2));
    if (Number(c2) !== 0) {
      setGameState(GameState.JOINED);
    }
  };

  const findGame = async () => {
    try {
      if (!isValidEthAddress(gameId || enteredGameId)) {
        console.error("Invalid Ethereum Address!");
        setError("Invalid Ethereum Address!");
        return;
      }
      setLoading(true);
      setLocalStorageData<string>(
        GameTexts.LOCAL_STORAGE_KEY,
        gameId ?? enteredGameId
      );
      const newRpsContract = contractInstance(RpsAbi, enteredGameId || gameId!);
      setContractAddress(enteredGameId || gameId!);
      const stake = await newRpsContract.methods
        .stake()
        .call({ from: connectedAccount });
      setStake(Number(stake));
      setGameState(GameState.GAME_FOUND);
    } catch (error) {
      console.error("Error finding the game:", error);
    } finally {
      if (gameState === GameState.JOINED) setLoading(false);
    }
  };

  const recallStakeAmount = async () => {
    const stake = await contract.methods
      .stake()
      .call({ from: connectedAccount });
    setStake(Number(stake));
  };

  useEffect(() => {
    if (timeLeft === "0 (Timed out)") {
      recallStakeAmount();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (contract && contractAddress) {
      getP2Move();
    }
  }, [contract, contractAddress]);

  useEffect(() => {
    if (
      (gameState === GameState.JOINED && fetchedMove !== 0) ||
      gameState === GameState.STUCKED ||
      (gameState === GameState.GAME_FOUND && timeLeft)
    ) {
      setLoading(false);
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameId) {
      findGame();
    }
  }, [gameId]);

  useEffect(() => {
    if (resetTimer) setResetTimer(false);
  }, [resetTimer]);

  return (
    <Stack gap={4} my={4}>
      {loading && <Loading />}
      <Typography variant="h5">{GameTexts.JOIN_GAME}</Typography>
      <>
        <Stack width={"40%"} gap={4} minWidth={"400px"}>
          <TextField
            value={enteredGameId || gameId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEnteredGameId(event.target.value)
            }
            label={"Enter Game ID"}
            helperText={error}
            error={!!error}
          />
          <Button
            variant="contained"
            onClick={() => {
              findGame();
            }}
          >
            {gameState === GameState.GAME_FOUND ||
            gameState === GameState.JOINED
              ? GameTexts.REFRESH_GAME
              : GameTexts.FIND_GAME}
          </Button>
        </Stack>
        {stake && timeLeft ? (
          <Stack gap={4}>
            <Typography>Staked funds in the game: {stake}</Typography>
            <Typography>Timeleft: {timeLeft ?? "NA"}</Typography>
            {timeLeft === "0 (Timed out)" &&
              stake !== 0 &&
              gameState === GameState.JOINED && (
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <Stack direction={"column"} gap={1}>
                    <Typography>
                      {"Player 1 didn't calculated the result"}
                    </Typography>
                    <Typography variant="caption">
                      {"(if it doesn't work, refresh the page and try again)"}
                    </Typography>
                  </Stack>
                  <Button variant="outlined" onClick={getP2Funds}>
                    {GameTexts.GET_FUNDS}
                  </Button>
                </Stack>
              )}
            {gameState === GameState.FUNDS_RETURNED && (
              <Typography color="green" mt={-2}>
                {GameTexts.FUNDS_REFUNDED}
              </Typography>
            )}
            <OptionCards move={move || fetchedMove} setMove={setMove} />
            <Stack width={"40%"} gap={4}>
              <Button
                disabled={
                  move === 0 ||
                  gameState === GameState.JOINED ||
                  fetchedMove !== 0
                }
                variant="outlined"
                onClick={handlePlayGame}
              >
                {gameState === GameState.JOINED || fetchedMove !== 0
                  ? "Move Submitted"
                  : "Submit your move"}
              </Button>
            </Stack>
          </Stack>
        ) : loading ? (
          <></>
        ) : stake === 0 ? (
          <Typography>
            Result calculated for this game, ask player 1 for the result
          </Typography>
        ) : (
          <></>
        )}
      </>
    </Stack>
  );
};

export default JoinGame;
