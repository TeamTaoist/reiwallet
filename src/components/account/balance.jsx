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
    margin: 20px auto 44px;
`

const Title = styled.div`

  margin: 0 auto 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .total{
        font-size: 28px;
        font-weight: 500;
        color: #000000;
        line-height: 40px;
    }
 
    .subTitle,.titletop{
        display: flex;
        align-items: center;
        justify-content: center;
        gap:10px;
        font-size: 14px;
        font-weight: 500;
        color: #000000;
        line-height: 1.5em;
        opacity: 0.4;
    }
`


export default function Balance(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {balance,balanceLoading,symbol,occupied} = useBalance();


    const toSend = () =>{
        navigate("/send");
    }

    return <BalanceBox>
        {
            balanceLoading &&     <Loading showBg={false} />
        }
        {
            !balanceLoading &&  <Title className="medium-font">
            <div className="titletop">Total</div>
                <div className="total">
                    {balance} {symbol}
                </div>
            <div className="subTitle">
                <span>Occupied</span>
                {occupied} {symbol}
            </div>

            </Title>
        }

        <Button primary onClick={()=>toSend()}>{t('popup.account.send')}</Button>
    </BalanceBox>
}
