import { Stack, Typography } from "@mui/material";
import CopyToClipboardButton from "./CopyToClipboardButton";

interface MetaMaskButtonProps {
  isWalletConnected: boolean;
  account: string | null;
}

const MetaMaskButton = ({
  isWalletConnected,
  account,
}: MetaMaskButtonProps) => {
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
          ? `Connected Account: ${account}`
          : "Please connect your wallet"}
      </Typography>
      <CopyToClipboardButton text={account || ""} />
    </Stack>
  );
};

export default MetaMaskButton;
