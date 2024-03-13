import styled from "styled-components";
import AccountHeader from "./AccountHeader";
import Balance from "./balance";
import AccountTabs from "./AccountTabs";
import useCurrentAccount from "../../useHook/useCurrentAccount";

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
    // const {currentAccount} = useCurrentAccount();
    // const signMsg = () =>{
    //     console.log(currentAccount)
    //
    // }


    return <Box>
        {/*<button onClick={()=>signMsg()}>test</button>*/}
        <AccountHeader />
    <MainBox>
                <Balance />
                <AccountTabs />
            </MainBox>


    </Box>
}
