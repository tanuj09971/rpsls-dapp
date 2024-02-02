const isValidEthAddress = (str: string) => {
  if (str === "") {
    return false;
  }
  const regex = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);
  return regex.test(str);
};
export default isValidEthAddress;
