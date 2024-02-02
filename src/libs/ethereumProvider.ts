export const ethereumProvider =
  typeof window !== "undefined" && (window as any).ethereum;

export default ethereumProvider;
