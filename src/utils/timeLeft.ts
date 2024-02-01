export const timeLeft = async (
  rpsContract: any,
  account: string | null,
  setTimeLeftInGame: React.Dispatch<
    React.SetStateAction<string | number | undefined>
  >
) => {
  const lastAction = await rpsContract.methods
    .lastAction()
    .call({ from: account });
  const timeout = await rpsContract.methods.TIMEOUT().call({ from: account });
  const intervalId = setInterval(() => {
    const now = Date.now();
    const timeLeft =
      Number(lastAction) + Number(timeout) - Math.floor(now / 1000);
    setTimeLeftInGame(timeLeft > 0 ? `${timeLeft} seconds` : "0 (Timed out)");
    if (timeLeft < 0) clearInterval(intervalId);
  });
  return intervalId;
};
