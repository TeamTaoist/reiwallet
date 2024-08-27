import HeaderTop from "../../header/header";
import { useEffect, useState } from "react";
import Account from "../../account/account";
import styled from "styled-components";
import CreateRestore from "../../createIdentity/createRestore";

const Box = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow-y: auto;
`;

export default function WalletHome() {
  const [len, setLen] = useState(0);

  useEffect(() => {
    /*global chrome*/
    chrome.storage.local.get(["walletList"], (result) => {
      setLen(result.walletList?.length);
    });
  }, []);

  return (
    <Box>
      <HeaderTop />

      {!!len && (
        <Content>
          <Account />
        </Content>
      )}
      {!len && (
        <Content>
          <CreateRestore />
        </Content>
      )}
    </Box>
  );
}
