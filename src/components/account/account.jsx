import styled from "styled-components";
import AccountHeader from "./AccountHeader";
import Balance from "./balance";
import AccountTabs from "./AccountTabs";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`

const MainBox = styled.div`
    flex-grow: 1;
    padding-bottom: 100px;
`


export default function Account(){
    return <Box>
        <AccountHeader />
         <MainBox>
            <Balance />
            <AccountTabs />
        </MainBox>
    </Box>
}
