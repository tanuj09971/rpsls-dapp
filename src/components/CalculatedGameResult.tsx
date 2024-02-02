import { GameResult } from "@/libs/types";
import { Stack, Typography } from "@mui/material";
import React from "react";

interface CalculatedGameResultProps {
  calculatedResult: GameResult;
}

const CalculatedGameResult = ({
  calculatedResult,
}: CalculatedGameResultProps) => {
  return (
    <Stack direction={"column"}>
      <Typography>
        <strong>Winner: </strong>
        {calculatedResult.winner}
      </Typography>
      <Typography>
        <strong>P1 Address: </strong>
        {calculatedResult.p1Address}
      </Typography>
      <Typography textTransform={"capitalize"}>
        <strong>P1 Move: </strong>
        {calculatedResult.p1Move}
      </Typography>
      <Typography>
        <strong>P2 Address: </strong>
        {calculatedResult.p2Address}
      </Typography>
      <Typography textTransform={"capitalize"}>
        <strong>P2 Move: </strong>
        {calculatedResult.p2Move}
      </Typography>
      <Typography>
        <strong>Winning Amount: </strong>
        {Number(calculatedResult.stake) * 2} {"wei"}
      </Typography>
    </Stack>
  );
};

export default CalculatedGameResult;
