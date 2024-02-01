"use client";
import RPSGame from "@/components/RPSGame";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RPS_ABI from "@/contracts/RPS.abi.json";
import { HASHER_ADDRESS } from "@/contracts/ContractAddress";
import HASHER_ABI from "@/contracts/Hasher.abi.json";
import MetaMaskButton from "@/components/MetaMaskButton";
import Web3 from "web3";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [result, setResult] = useState<any>();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const joinValue = params.get("join");
  const resultValue = params.get("result");
  console.log("resultValue ================:>> ", resultValue);
  const idValue = params.get("id");

  const handlePlayGame = () => {
    checkMetaMask();
  };

  useEffect(() => {
    if (joinValue || resultValue) {
      checkMetaMask();
    }
    if (resultValue) {
      const result = {
        winner: params.get("winner"),
        p1Address: params.get("id"),
        p2Address: params.get("p2address"),
        p1Move: params.get("p1move"),
        p2Move: params.get("p2move"),
        stake: params.get("amount"),
      };
      setResult(result);
    }
  }, [joinValue, idValue, resultValue]);

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
    <Container maxWidth="lg" sx={{ minHeight: "100vh", p: 6 }}>
      <Stack
        gap={3}
        sx={{
          border: "1px solid #55505052",
          minHeight: "90vh",
          py: 4,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Typography variant="h4">Rock Paper Scissor Lizard Spock</Typography>

        {!isWalletConnected ? (
          <>
            <Button
              variant="contained"
              onClick={handlePlayGame}
              sx={{ width: "200px" }}
            >
              Play Game
            </Button>
            <Typography variant="caption">
              {"Please unlock Metamask, if it doesn't open automatically"}
            </Typography>
          </>
        ) : (
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
              joinValue={joinValue}
              idValue={idValue}
              resultValue={resultValue}
              result={result}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
