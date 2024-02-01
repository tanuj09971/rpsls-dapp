import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { useState } from "react";
const CopyToClipboardButton = (props: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { text } = props;
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 500);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard", err);
      });
  };

  return !isCopied ? (
    <ContentCopyIcon
      style={{ fontSize: "15px", cursor: "pointer" }}
      onClick={handleCopyClick}
    />
  ) : (
    <LibraryAddCheckIcon style={{ fontSize: "13px", cursor: "pointer" }} />
  );
};

export default CopyToClipboardButton;
