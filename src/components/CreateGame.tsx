import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import OptionCards from "./OptionCards";

interface CreateGameProps {
  generateHash: (move: number, salt: number | null) => void;
  hash: string;
  deployRPSContract: (
    c1HashValue: string,
    j2Address: string,
    stake: string | undefined
  ) => void;
  contractAddress: string;
  player1Move: number;
  setPlayer1Move: React.Dispatch<React.SetStateAction<number>>;
}

const CreateGame = ({
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
  return (
    <Stack gap={4} my={4}>
      <Typography variant="h5">Create Game</Typography>
      {!hash && (
        <>
          <Typography>Step - 1</Typography>
          <OptionCards setMove={setPlayer1Move} />
          <Stack width={"40%"} gap={4}>
            <TextField
              disabled
              value={`Your move: ${player1Move}`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPlayer1Move(parseInt(event.target.value))
              }
            />
            <TextField
              value={salt}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSalt(parseInt(event.target.value))
              }
              label={"Password / Salt"}
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
      )}
      {hash && (
        <Stack width={"30%"} gap={4}>
          <Typography>Step - 2</Typography>
          <TextField
            value={player2}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPlayer2(event.target.value)
            }
            label={"Enter player 2's address"}
          />
          <TextField
            value={stake}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setStake(event.target.value)
            }
            label={"How much you want to stake?"}
          />
          <Button
            variant="outlined"
            onClick={() => {
              deployRPSContract(hash, player2, stake);
            }}
          >
            Proceed
          </Button>
        </Stack>
      )}
      {contractAddress && (
        <Typography>
          Contract Address: {contractAddress} (copy and share with player 2)
        </Typography>
      )}
    </Stack>
  );
};

export default CreateGame;
