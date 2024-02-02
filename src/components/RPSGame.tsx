"use client";
import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import { CreateGame, JoinGame, CalculateResult } from "@/components";
import { getLocalStorageData } from "@/utils/localStorage";
import { GameState, GameModes, GameResult } from "@/libs/types";
import { GameTexts } from "@/utils/constants";

interface RPSGameProps {
  connectedAccount: string | undefined;
  isJoiner: string | null;
  gameId: string | null;
  showResult: string | null;
  gameResult: GameResult | null;
}

const RPSGame = ({
  connectedAccount,
  isJoiner,
  gameId,
  showResult,
  gameResult,
}: RPSGameProps) => {
  const [currMode, setCurrMode] = useState<GameModes>(
    isJoiner
      ? GameModes.JOIN
      : showResult
      ? GameModes.CALCULATE
      : GameModes.NONE
  );
  const [contractAddress, setContractAddress] = useState("");
  const [player1Move, setPlayer1Move] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);

  const checkContractAddress = () => {
    if (!contractAddress) {
      if (window) {
        window.alert("Create a game first!");
      }
      return false;
    }
    return true;
  };

  const goToCreateGame = async () => {
    setCurrMode(GameModes.CREATE);
  };

  const goToJoinGame = async () => {
    if (!checkContractAddress()) return;
    setCurrMode(GameModes.JOIN);
  };

  const goToCalculateResult = async () => {
    if (!checkContractAddress()) return;
    setCurrMode(GameModes.CALCULATE);
  };

  useEffect(() => {
    const sessionGameId = getLocalStorageData<string>(
      GameTexts.LOCAL_STORAGE_KEY
    );
    if (sessionGameId) setContractAddress(sessionGameId);
  }, []);

  return (
    <Stack mx={2} sx={{ ...(currMode !== GameModes.NONE && { width: "90%" }) }}>
      <Stack gap={1} direction={"row"}>
        <Button variant="contained" onClick={goToCreateGame}>
          {GameTexts.CREATE_GAME}
        </Button>
        <Button variant="contained" onClick={goToJoinGame}>
          {GameTexts.JOIN_GAME}
        </Button>
        <Button variant="contained" onClick={goToCalculateResult}>
          {GameTexts.CALCULATE_RESULT}
        </Button>
      </Stack>
      <Stack
        sx={
          currMode !== GameModes.NONE
            ? { minHeight: "650px", minWidth: "48vw" }
            : {}
        }
      >
        {currMode === GameModes.CREATE && (
          <CreateGame
            connectedAccount={connectedAccount}
            gameState={gameState}
            setGameState={setGameState}
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            player1Move={player1Move}
            setPlayer1Move={setPlayer1Move}
          />
        )}
        {currMode === GameModes.JOIN && (
          <JoinGame
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            connectedAccount={connectedAccount}
            gameId={showResult ? "" : gameId}
            gameState={gameState}
            setGameState={setGameState}
          />
        )}
        {currMode === GameModes.CALCULATE && (
          <CalculateResult
            gameResult={gameResult}
            contractAddress={contractAddress}
            connectedAccount={connectedAccount}
            gameState={gameState}
            setGameState={setGameState}
            player1Move={player1Move}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default RPSGame;
