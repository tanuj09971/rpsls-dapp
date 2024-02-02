import {
  Button,
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { OptionCards, Loading, CopyToClipboardButton } from "@/components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MatchPrimitiveType } from "web3";
import isValidEthAddress from "@/utils/isValidEthAddress";
import { GameState, QueryParams } from "@/libs/types";
import { GameTexts } from "@/utils/constants";
import { setLocalStorageData } from "@/utils/localStorage";
import generateHash from "@/services/generateHash";
import deployRpsContract from "@/services/deployRpsContract";

interface CreateGameProps {
  connectedAccount: string | undefined;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  contractAddress: string;
  setContractAddress: Dispatch<SetStateAction<string>>;
  player1Move: number;
  setPlayer1Move: React.Dispatch<React.SetStateAction<number>>;
}

const CreateGame = ({
  connectedAccount,
  gameState,
  setGameState,
  contractAddress,
  setContractAddress,
  player1Move,
  setPlayer1Move,
}: CreateGameProps) => {
  const [salt, setSalt] = useState<number | string>("");
  const [player2, setPlayer2] = useState("");
  const [stake, setStake] = useState<string>("");
  const [joinLink, setJoinLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(2);
  const [error, setError] = useState<string>("");
  const [commitHash, setCommitHash] =
    useState<MatchPrimitiveType<"bytes32", unknown>>("");

  const handleCommitHash = async () => {
    const hash = await generateHash(player1Move, salt, connectedAccount);
    if (hash) {
      setGameState(GameState.HASHED_COMMITTED);
      setCommitHash(hash);
    }
  };

  const handleDeployRpsContract = async () => {
    try {
      if (!isValidEthAddress(player2)) {
        console.error("Invalid Ethereum Address!");
        setError("Invalid Ethereum Address!");
        return;
      }
      setLoading(true);
      const deployedContractAddress = await deployRpsContract(
        commitHash,
        player2,
        stake,
        connectedAccount
      );
      if (deployedContractAddress) {
        setContractAddress(deployedContractAddress);
        setGameState(GameState.PLAYER_INVITED);
        setLocalStorageData<string>(
          GameTexts.LOCAL_STORAGE_KEY,
          deployedContractAddress
        );
      }
    } catch (err) {
      console.error(err);
      setGameState(GameState.STUCKED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractAddress && gameState === GameState.PLAYER_INVITED) {
      const generatedLink = `${window.location.origin.toString()}?${
        QueryParams.JOIN
      }=true&${QueryParams.GAME_ID}=${contractAddress}`;
      setJoinLink(generatedLink);
      setLoading(false);
      setStep(3);
    }
  }, [contractAddress]);

  useEffect(() => {
    if (gameState === GameState.STUCKED) {
      setGameState(GameState.HASHED_COMMITTED);
      setLoading(false);
    }
  }, [gameState]);

  return (
    <Stack gap={4} my={4}>
      {loading && <Loading />}
      <Typography variant="h5">{GameTexts.CREATE_GAME}</Typography>
      <Accordion expanded={gameState === GameState.INITIAL}>
        <AccordionSummary
          expandIcon={
            gameState === GameState.INITIAL ? (
              <ExpandMoreIcon sx={{ cursor: "default" }} />
            ) : (
              <CheckCircleOutlineIcon sx={{ cursor: "default" }} />
            )
          }
          aria-controls="step1-content"
          id="step1-header"
          sx={{ px: 3, py: 1 }}
        >
          <Typography sx={{ width: "40%", flexShrink: 0 }}>Step - 1</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {GameTexts.COMMIT_MOVE}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3, pb: 3 }}>
          <>
            <OptionCards setMove={setPlayer1Move} move={player1Move} />
            <Stack width={"40%"} gap={4} mt={2}>
              <TextField
                value={salt}
                type="number"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSalt(parseInt(event.target.value))
                }
                label={"Password (4 digits preferred)"}
                variant="standard"
              />
              <Button variant="outlined" onClick={handleCommitHash}>
                {GameTexts.COMMIT_MOVE}
              </Button>
            </Stack>
          </>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={gameState === GameState.HASHED_COMMITTED && step !== 3}
      >
        <AccordionSummary
          expandIcon={
            step !== 3 ? (
              <ExpandMoreIcon sx={{ cursor: "default" }} />
            ) : (
              <CheckCircleOutlineIcon sx={{ cursor: "default" }} />
            )
          }
          aria-controls="step1-content"
          id="step1-header"
          sx={{ px: 3, py: 1 }}
        >
          <Typography sx={{ width: "40%", flexShrink: 0 }}>Step - 2</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {GameTexts.INVITE}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3, pb: 3 }}>
          <Stack minWidth={"400px"} width={"30%"} gap={4}>
            <TextField
              value={player2}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPlayer2(event.target.value)
              }
              label={"Enter player 2's address"}
              variant="standard"
              helperText={error}
              error={!!error}
            />
            <TextField
              value={stake}
              type="number"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setStake(event.target.value)
              }
              label={"How much you want to stake? (in Wei)"}
              variant="standard"
            />
            <Button variant="outlined" onClick={handleDeployRpsContract}>
              {GameTexts.PROCEED_AND_INVITE}
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
      {joinLink && (
        <Stack
          p={1}
          gap={1}
          sx={{
            alignItems: "center",
          }}
        >
          <Typography>
            Link: {joinLink} <CopyToClipboardButton text={joinLink} />
          </Typography>
          <Typography color={"text.secondary"}>
            (copy and share with player 2)
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default CreateGame;
