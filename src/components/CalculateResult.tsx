import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

interface CalculateResultProps {
  solve: (salt: number | null) => void;
}

const CalculateResult = ({ solve }: CalculateResultProps) => {
  const [salt, setSalt] = useState<number | null>(null);
  return (
    <Stack gap={4} my={4}>
      <Typography variant="h5">Calculate Result</Typography>
      <Stack gap={4}>
        <Stack width={"40%"} gap={4}>
          <TextField
            value={salt}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSalt(parseInt(event.target.value))
            }
            label={"Password / Salt"}
          />
          <Button
            variant="contained"
            onClick={() => {
              solve(salt);
            }}
          >
            Get result
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CalculateResult;
