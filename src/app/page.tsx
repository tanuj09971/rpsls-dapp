"use client";
import { RPSGame, MetaMaskAccount } from "@/components";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import web3Instance from "@/libs/web3Instance";
import ethereumProvider from "@/libs/ethereumProvider";
import { useSearchParams } from "next/navigation";
import { QueryParams, GameResult } from "@/libs/types";
import { GameTexts } from "@/utils/constants";
import getResultFromUrl from "@/utils/getResultFromUrl";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const searchParams = useSearchParams();

  const { isJoiner, gameId, showResult, gameResult } = useMemo(() => {
    const urlQueryParams = new URLSearchParams(searchParams.toString());
    const result: GameResult | null = urlQueryParams.get(QueryParams.RESULT)
      ? getResultFromUrl(urlQueryParams)
      : null;
    return {
      isJoiner: urlQueryParams.get(QueryParams.JOIN),
      gameId: urlQueryParams.get(QueryParams.GAME_ID),
      showResult: urlQueryParams.get(QueryParams.RESULT),
      gameResult: result,
    };
  }, [searchParams]);

  const handleStartGame = async () => {
    if (ethereumProvider) {
      try {
        await ethereumProvider.request({ method: "eth_accounts" });
        connectWallet();
      } catch (error) {
        console.error("MetaMask not connected:", error);
      }
    } else {
      console.warn(GameTexts.INSTALL_METAMASK);
      if (window) window.alert(GameTexts.INSTALL_METAMASK);
    }
  };

  const connectWallet = async () => {
    try {
      await ethereumProvider.request({ method: "eth_requestAccounts" });
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length) {
        setIsWalletConnected(true);
        setConnectedAccount(accounts[0]); // Select first account from Metamask wallet
      }
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
    }
  };

  // When player2 joins the game or sees the result
  useEffect(() => {
    if (isJoiner || showResult) {
      handleStartGame();
    }
  }, [isJoiner, showResult]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        px: 6,
        py: 4,
      }}
    >
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
        <Typography variant="h4">{GameTexts.TITLE}</Typography>

        {!isWalletConnected ? (
          <>
            <Button
              variant="contained"
              onClick={handleStartGame}
              sx={{ width: "200px" }}
            >
              {GameTexts.PLAY_GAME}
            </Button>
            <Typography variant="caption">
              {GameTexts.UNLOCK_METAMASK}
            </Typography>
          </>
        ) : (
          <>
            <MetaMaskAccount
              isWalletConnected={isWalletConnected}
              connectedAccount={connectedAccount}
            />

            <RPSGame
              connectedAccount={connectedAccount}
              isJoiner={isJoiner}
              gameId={gameId}
              showResult={showResult}
              gameResult={gameResult}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
