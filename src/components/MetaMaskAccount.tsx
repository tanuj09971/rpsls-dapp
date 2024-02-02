import { Stack, Typography } from "@mui/material";
import CopyToClipboardButton from "./CopyToClipboardButton";

interface MetaMaskAccountProps {
  isWalletConnected: boolean;
  connectedAccount: string | undefined;
}

const MetaMaskAccount = ({
  isWalletConnected,
  connectedAccount,
}: MetaMaskAccountProps) => {
  return (
    <Stack
      sx={{
        background: "1px solid #55505052",
        backgroundColor: "#FFF",
        px: 2,
        py: 1,
        borderRadius: "10px",
      }}
      direction={"row"}
      alignItems={"center"}
      gap={1}
    >
      <Typography variant="body1">
        {isWalletConnected
          ? `Connected Account: ${connectedAccount}`
          : "Please connect your wallet"}
      </Typography>
      {isWalletConnected && (
        <CopyToClipboardButton text={connectedAccount ?? ""} />
      )}
    </Stack>
  );
};

export default MetaMaskAccount;
