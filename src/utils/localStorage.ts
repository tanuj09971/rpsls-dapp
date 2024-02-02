export const getLocalStorageData = <T>(key: string): T | string | null => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      return parsedData;
    } catch {
      // If parsing fails, return as string
      return storedData;
    }
  }
  return null;
};

export const setLocalStorageData = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error setting value in localStorage:", error);
  }
};
