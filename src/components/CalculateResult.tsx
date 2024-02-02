import { Button, Stack, TextField, Typography } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Loading,
  CopyToClipboardButton,
  CalculatedGameResult,
} from "@/components";
import { MatchPrimitiveType } from "web3";
import { RpsAbi } from "@/contracts/ABI";
import contractInstance from "@/utils/getContractInstance";
import { useTimeLeft } from "@/hooks/useTimeLeft";
import { GameState, QueryParams, GameResult } from "@/libs/types";
import { GameTexts } from "@/utils/constants";
import solveGame from "@/services/solveGame";

interface CalculateResultProps {
  contractAddress: string;
  gameResult: GameResult | null;
  connectedAccount: string | undefined;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  player1Move: number;
}

const CalculateResult = ({
  contractAddress,
  gameResult,
  connectedAccount,
  gameState,
  setGameState,
  player1Move,
}: CalculateResultProps) => {
  const [salt, setSalt] = useState<MatchPrimitiveType<"uint256", unknown>>();
  const [loading, setLoading] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState<GameResult>();
  const [resultLink, setResultLink] = useState("");
  const [p2Move, setP2Move] = useState<number | undefined>();
  const { timeLeft, intervalIdRef } = useTimeLeft(
    contractAddress,
    connectedAccount,
    gameState,
    false,
    !!gameResult
  );

  const contract = useMemo(() => {
    return contractInstance(RpsAbi, contractAddress);
  }, [contractAddress]);

  const getP2Move = async () => {
    const c2 = await contract.methods.c2().call({ from: connectedAccount });
    setP2Move(Number(c2));
  };

  const getP1Funds = async () => {
    try {
      setLoading(true);
      const gasEstimate = await contract.methods
        .j2Timeout()
        .estimateGas({ from: connectedAccount });
      const j2Out = await contract.methods
        .j2Timeout()
        .send({ from: connectedAccount, gas: gasEstimate.toString() });
      if (j2Out) {
        setGameState(GameState.FUNDS_RETURNED);
      }
    } catch (error) {
      console.error("Error calling getP1Funds method:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSolveGame = async () => {
    try {
      setLoading(true);
      const res = await solveGame(
        salt,
        contractAddress,
        connectedAccount,
        player1Move
      );
      setCalculatedResult(res);
      if (intervalIdRef) {
        clearInterval(intervalIdRef.current);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!gameResult || calculatedResult) {
      getP2Move();
    }
  }, [gameResult, calculatedResult]);

  useEffect(() => {
    if (gameResult) {
      setCalculatedResult(gameResult);
    }
  }, []);

  useEffect(() => {
    if (calculatedResult) {
      const generatedLink = `${window.location.origin.toString()}?${
        QueryParams.RESULT
      }=true&${QueryParams.P1_ADDRESS}=${calculatedResult.p1Address}&${
        QueryParams.WINNER
      }=${calculatedResult.winner}&${QueryParams.P2_ADDRESS}=${
        calculatedResult.p2Address
      }&${QueryParams.P1_MOVE}=${calculatedResult.p1Move}&${
        QueryParams.P2_MOVE
      }=${calculatedResult.p2Move}&${QueryParams.STAKE}=${
        calculatedResult.stake
      }`;
      setResultLink(generatedLink);
    }
  }, [calculatedResult]);
  return (
    <Stack gap={4} my={4}>
      {loading && <Loading />}
      <Typography variant="h5">{GameTexts.CALCULATE_RESULT}</Typography>
      <Stack gap={4}>
        <Stack width={"40%"} gap={4}>
          {p2Move !== 0 && gameResult?.p2Address !== connectedAccount && (
            <Typography>
              Player 2 submitted his move, calculate result and know the winner
            </Typography>
          )}
          <Typography mb={-1}>Timeleft: {timeLeft ?? "NA"}</Typography>
          {timeLeft === GameTexts.TIMED_OUT && p2Move === 0 && (
            <Stack direction={"row"} alignItems={"center"} gap={2}>
              <Typography>{"Player 2 didn't submit his move"}</Typography>
              <Button
                variant="outlined"
                onClick={getP1Funds}
                disabled={gameState === GameState.FUNDS_RETURNED}
              >
                {GameTexts.GET_FUNDS}
              </Button>
            </Stack>
          )}
          {gameState === GameState.FUNDS_RETURNED && (
            <Typography color="green">{GameTexts.FUNDS_REFUNDED}</Typography>
          )}
          <TextField
            value={salt}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSalt(event.target.value)
            }
            label={"Password"}
            helperText={"(which was used while commiting your move)"}
          />
          <Button variant="contained" onClick={handleSolveGame}>
            {GameTexts.GET_RESULT}
          </Button>
        </Stack>
      </Stack>
      {calculatedResult && (
        <CalculatedGameResult calculatedResult={calculatedResult} />
      )}
      {resultLink && (
        <Stack py={1} gap={1}>
          <Typography flexWrap={"wrap"} maxWidth={"100%"}>
            <strong>Link:</strong> {resultLink}{" "}
            <CopyToClipboardButton text={resultLink} />
          </Typography>
          <Typography color={"text.secondary"}>
            (Copy to share result with player 2)
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default CalculateResult;
