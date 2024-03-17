import styled from "styled-components";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Loading from "../loading/loading";
import useBalance from "../../useHook/useBalance";

const BalanceBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 44px auto;
`

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: #000000;
  line-height: 40px;
  margin: 0 auto 12px;
`

export default function Balance(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {balance,balanceLoading,symbol} = useBalance();


    const toSend = () =>{
        navigate("/send");
    }

    return <BalanceBox>
        {
            balanceLoading &&     <Loading showBg={false} />
        }
        {
            !balanceLoading &&  <Title className="medium-font">
                {balance} {symbol}
            </Title>
        }

        <Button primary onClick={()=>toSend()}>{t('popup.account.send')}</Button>
    </BalanceBox>
}
