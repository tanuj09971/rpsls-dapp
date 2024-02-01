import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import CopyToClipboardButton from "./CopyToClipboardButton";

interface CalculateResultProps {
  solve: (salt: number | null) => any;
  idValue: string | null;
  result: any;
}

const CalculateResult = ({
  solve,
  idValue,
  result,
}: CalculateResultProps) => {
  const [salt, setSalt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<any>();
  const [resultLink, setResultLink] = useState("");

  console.log("idValue :>> ", idValue);

  const handleSolve = async () => {
    setLoading(true);
    const res = await solve(salt);
    setWinner(res);
    if (res) {
      setLoading(false);
    }
    console.log("res======================= :>> ", res);
  };
  useEffect(() => {
    if (result) {
      setWinner(result);
    }
  }, []);

  useEffect(() => {
    if (winner) {
      const generatedLink = `${process.env.NEXT_PUBLIC_BASE_URL}?result=true&id=${winner.p1Address}&winner=${winner.winner}&p2address=${winner.p2Address}&p1move=${winner.p1Move}&p2move=${winner.p2Move}&amount=${winner.stake}`;
      setResultLink(generatedLink);
    }
  }, [winner]);

  return (
    <Stack gap={4} my={4} maxWidth={"60%"}>
      {loading && <Loading />}
      <Typography variant="h5">Calculate Result</Typography>
      <Stack gap={4}>
        <Stack width={"40%"} gap={4}>
          <TextField
            value={salt}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSalt(parseInt(event.target.value))
            }
            label={"Password"}
            helperText={"(which was used while commiting your move)"}
          />
          <Button variant="contained" onClick={handleSolve}>
            Get result
          </Button>
        </Stack>
      </Stack>
      {winner && (
        <Stack direction={"column"}>
          <Typography>
            <strong>Winner: </strong>
            {winner.winner}
          </Typography>
          <Typography>
            <strong>P1 Address: </strong>
            {winner.p1Address}
          </Typography>
          <Typography textTransform={"capitalize"}>
            <strong>P1 Move: </strong>
            {winner.p1Move}
          </Typography>
          <Typography>
            <strong>P2 Address: </strong>
            {winner.p2Address}
          </Typography>
          <Typography textTransform={"capitalize"}>
            <strong>P2 Move: </strong>
            {winner.p2Move}
          </Typography>
          <Typography>
            <strong>Winning Amount: </strong>
            {winner.stake}
          </Typography>
        </Stack>
      )}
      {resultLink && (
        <Stack
          py={1}
          gap={1}
        >
          <Typography>
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
