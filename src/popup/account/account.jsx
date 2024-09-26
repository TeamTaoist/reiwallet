import styled from "styled-components";
import AccountHeader from "./accountHeader";
import Balance from "./balance";
import AccountTabs from "./accountTabs";
import { useNavigate } from "react-router-dom";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const MainBox = styled.div`
  flex-grow: 1;
  padding-bottom: 20px;
`;

export default function Account() {
  const navigate = useNavigate();

  return (
    <Box>
      <AccountHeader />
      <MainBox>
        <Balance />
        <AccountTabs />
      </MainBox>
    </Box>
  );
}
