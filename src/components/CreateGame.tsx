import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import OptionCards from "./OptionCards";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CopyToClipboardButton from "./CopyToClipboardButton";
import Loading from "./Loading";

interface CreateGameProps {
  web3: any;
  generateHash: (move: number, salt: number | null) => void;
  hash: string;
  deployRPSContract: (
    c1HashValue: string,
    j2Address: string,
    stake: string | undefined
  ) => Promise<string>;
  contractAddress: string;
  player1Move: number;
  setPlayer1Move: React.Dispatch<React.SetStateAction<number>>;
}

const CreateGame = ({
  web3,
  generateHash,
  hash,
  deployRPSContract,
  contractAddress,
  player1Move,
  setPlayer1Move,
}: CreateGameProps) => {
  const [salt, setSalt] = useState<number | null>(null);
  const [player2, setPlayer2] = useState("");
  const [stake, setStake] = useState<string | undefined>();
  const [joinLink, setJoinLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(2);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let generatedLink;
    if (contractAddress) {
      generatedLink = `${process.env.NEXT_PUBLIC_BASE_URL}?join=true&id=${contractAddress}`;
      setJoinLink(generatedLink);
      setLoading(false);
      setStep(3);
    }
  }, [contractAddress]);

  return (
    <Stack gap={4} my={4}>
      {loading && <Loading />}
      <Typography variant="h5">Create Game</Typography>
      <Accordion expanded={!hash}>
        <AccordionSummary
          expandIcon={
            !hash ? (
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
            Commit your move
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
              <Button
                variant="outlined"
                onClick={() => {
                  generateHash(player1Move, salt);
                }}
              >
                Commit your move
              </Button>
            </Stack>
          </>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={!!hash && step !== 3}>
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
            Invite player 2
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
            <Button
              variant="outlined"
              onClick={() => {
                if (!web3.utils.isAddress(player2)) {
                  console.error("Invalid Ethereum Address!");
                  setError("Invalid Ethereum Address!");
                  return;
                }
                deployRPSContract(hash, player2, stake);
                setLoading(true);
              }}
            >
              Proceed & Invite player 2
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
