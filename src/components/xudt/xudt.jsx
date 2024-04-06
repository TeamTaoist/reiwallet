import Loading from "../loading/loading";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import {useEffect, useState} from "react";
import {useWeb3} from "../../store/contracts";
import useAccountAddress from "../../useHook/useAccountAddress";
import PublicJS from "../../utils/publicJS";
import Next from "../../assets/images/into.png";
import useXUDT from "../../useHook/useXUDT";
import styled from "styled-components";

const Box = styled.div`
  padding: 23px 20px;
  li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 68px;
    border-radius: 14px;
    padding: 0 27px;
    cursor: pointer;
      background: #fafafa;
      margin-bottom: 20px;
    &:hover{
      background: #F1FCF1;
    }
      .flex{
          display: flex;
          align-content: center;
          justify-content: space-between;
          width: 100%;
      }
    span{
      font-size: 18px;
      font-weight: 500;
      color: #000000;
      line-height: 25px;
    }
      .flexInner{
          display: flex;
          align-items: center;
          gap:5px;
      }
      .owner{
          background: #00FF9D;
          font-size: 10px;
          padding: 2px 4px;
          line-height: 10px;
          border-radius: 4px;
          height: 14px;
          box-sizing: border-box;
      }
  }
`


const FlexLft = styled.div`
    display: flex;
    align-content: center;
    font-size: 10px;
    gap:5px;
    .token{
        opacity: 0.5;
    }

`

const FlexRht = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
 
`

const SendBox = styled.div`
    font-size: 16px;
    font-family: "AvenirNext-Medium";
    font-weight: bold;
    color: #00A554;
`

const LoadingBox = styled.div`
    margin-top: 30px;
`

export default function XUDT(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {list,loading} = useXUDT();
    const {currentAccount} = useCurrentAccount();
    const [sList,setSList] = useState([])
    const {dispatch} = useWeb3();
    const {currentAccountInfo} = useAccountAddress();

    useEffect(() => {
        if(list === '' || !currentAccountInfo?.address)return;
        formatList()
    }, [list,currentAccount,currentAccountInfo]);


    const formatList =  () =>{

    }

    const toDetail = (item) =>{
        dispatch({type:'SET_XUDT_DETAIL',payload:item});
        navigate("/xudtdetail");
    }

    return <Box>
        {
            loading && <LoadingBox><Loading showBg={false}/></LoadingBox>
        }
        <ul>
            {
                sList.map((item, index) => (<li key={index} onClick={() => toDetail(item)}>
                    <div className="flex">
                        <div>
                            <div className="flexInner">
                                <span className="medium-font">{item?.sum?.toString()} </span>
                                {
                                    item?.argAddress === item.output.type.args && <div className="owner">owner</div>
                                }
                            </div>
                            <FlexLft>
                                <div className="token">token</div>
                                <div className="token">{PublicJS.AddressToShow(item?.output?.type?.args)}</div>
                            </FlexLft>
                        </div>
                        <FlexRht>
                            {/*<SendBox>Send</SendBox>*/}

                            <img src={Next} alt=""/>
                        </FlexRht>

                    </div>

                </li>))
            }
        </ul>
    </Box>
}
