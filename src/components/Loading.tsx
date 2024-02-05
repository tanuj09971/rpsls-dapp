import { CircularProgress, Stack } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <Stack
      minHeight={"100vh"}
      minWidth={"100vw"}
      position={"absolute"}
      top={0}
      left={0}
      zIndex={100}
      bgcolor={"#d4d4d4b0"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <CircularProgress size={40} />
    </Stack>
  );
};

export default Loading;
