import { Stack, Typography } from "@mui/material";

interface MetaMaskButtonProps {
  isWalletConnected: boolean;
  account: string | null;
}

const MetaMaskButton = ({
  isWalletConnected,
  account,
}: MetaMaskButtonProps) => {
  return (
    <Stack>
      <Typography variant="body1">
        {isWalletConnected
          ? `Connected Account:${account}`
          : "Please connect your wallet"}
      </Typography>
    </Stack>
  );
};

export default MetaMaskButton;
