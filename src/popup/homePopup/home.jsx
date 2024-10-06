import CreateRestore from "../createIdentity/createRestore";
import WalletHome from "../wallet/createWallet/walletHome";
import Lock from "../lock/lock";
import styled from "styled-components";
import { useEffect, useState } from "react";
import useLock from "../../hooks/useLock";

const Box = styled.div`
  height: 600px;
`;

export default function Home() {
  const [showHome, setShowHome] = useState(false);
  const Unlocked = useLock();

  useEffect(() => {
    /*global chrome*/
    chrome.storage.local.get(["isInit"], (result) => {
      if (result?.isInit) {
        setShowHome(false);
      } else {
        setShowHome(true);
      }
    });
  }, []);
  const methodDoesNotExist = () => {
    // console.log("methodDoesNotExist",aaa.toString());
    throw new Error("Method doesn't exist 333");
  };

  return (
    <Box>
      <button onClick={() => methodDoesNotExist()}>Break the world</button>
      {!showHome && Unlocked && <WalletHome />}
      {!showHome && !Unlocked && <Lock />}
      {showHome && <CreateRestore />}
    </Box>
  );
}
