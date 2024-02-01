"use client";
import RPSGame from "@/components/RPSGame";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import RPS_ABI from "@/contracts/RPS.abi.json";
import { HASHER_ADDRESS } from "@/contracts/ContractAddress";
import HASHER_ABI from "@/contracts/Hasher.abi.json";
import MetaMaskButton from "@/components/MetaMaskButton";
import Web3 from "web3";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const handlePlayGame = () => {
    checkMetaMask();
  };

  const checkMetaMask = async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: "eth_accounts" });
        connectWallet();
      } catch (error) {
        console.error("MetaMask not connected:", error);
      }
    } else {
      window.alert("Please install Metamask, to play RPSLS!");
      console.log("Please install Metamask, to play RPSLS! :>> ");
    }
  };

  const connectWallet = async () => {
    const web3 = new Web3((window as any).ethereum); // Create a Web3 instance using the injected provider
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        setIsWalletConnected(true);
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
    }
  };
  return (
    <Container
      maxWidth="lg"
      sx={{ minHeight: "100vh", p: 6, border: "1px solid #55505052" }}
    >
      <Stack gap={3}>
        <Typography variant="h4">RPS Game</Typography>
        <Button
          variant="contained"
          onClick={handlePlayGame}
          sx={{ width: "200px" }}
        >
          Play Game
        </Button>
        {isWalletConnected && (
          <>
            <MetaMaskButton
              isWalletConnected={isWalletConnected}
              account={account}
            />

            <RPSGame
              rpsAbi={RPS_ABI}
              hasherAddress={HASHER_ADDRESS}
              hasherAbi={HASHER_ABI}
              account={account}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
