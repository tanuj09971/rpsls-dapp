import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { GameMoves } from "@/utils/constants";

const OptionCards = ({
  setMove,
  move,
}: {
  setMove: React.Dispatch<React.SetStateAction<number>>;
  move: number;
}) => {
  return (
    <Stack direction={"row"} gap={2}>
      {GameMoves.map((item, idx) => (
        <Box
          key={idx + 1}
          sx={{
            flexDirection: "column",
            borderRadius: "20px",
            height: "150px",
            width: "150px",
            border: "1px solid #55505052",
            ...(move === idx + 1 && {
              background: "#00e3ff30",
            }),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            textTransform: "capitalize",
            gap: 1,
          }}
          onClick={() => setMove(idx + 1)}
        >
          <Image
            src={`/images/${item}.png`}
            alt="img"
            width={"60"}
            height={"60"}
          />
          <Typography variant="overline" fontWeight={"bold"} color={"#737373"}>
            {item}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

export default OptionCards;
