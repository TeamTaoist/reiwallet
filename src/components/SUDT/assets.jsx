import styled from "styled-components";
import Next from "../../assets/images/into.png"
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import useSUDT from "../../useHook/useSUDT";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import { predefined } from '@ckb-lumos/config-manager'

import PublicJS from "../../utils/publicJS";
import {unpackAmount,ownerForSudt} from "@ckb-lumos/common-scripts/lib/sudt";
import useAccountAddress from "../../useHook/useAccountAddress";
import {useWeb3} from "../../store/contracts";
import Loading from "../loading/loading";
import {BI} from "@ckb-lumos/lumos";


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

export default function Assets(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {list,loading} = useSUDT();
    const {currentAccount} = useCurrentAccount();
    const [sList,setSList] = useState([])
    const {dispatch} = useWeb3();
    const {currentAccountInfo} = useAccountAddress();

    useEffect(() => {
        if(list === '' || !currentAccountInfo?.address)return;
        formatList()
    }, [list,currentAccount,currentAccountInfo]);


    const formatList =  () =>{
        let arr = [...list];
        let arrFormat =  arr.map((item)=>{
            item.amount = unpackAmount(item.output_data)?.toString();
            const prefix = currentAccountInfo?.address.slice(0, 3)
            const config = prefix === 'ckt' ? predefined.AGGRON4 : predefined.LINA
            item.argAddress = ownerForSudt(currentAccountInfo?.address, {config})
            return item
        })


        const groupedData = arrFormat.reduce((acc, obj) => {
            const key = obj.argAddress;
            if (!acc[key]) {
                acc[key] = { category: key, sum: BI.from(0),...obj };
            }
            acc[key].sum = acc[key].sum.add(obj.amount);

            return acc;
        }, {});
        const result = Object.values(groupedData);
        setSList(result)
    }


    const toDetail = (item) =>{
        dispatch({type:'SET_SUDT_DETAIL',payload:item});
        navigate("/sendSUDT");
    }

    return <Box>
        {
            loading && <LoadingBox><Loading showBg={false} /></LoadingBox>
        }
        <ul>
            {
                sList.map((item,index)=>(<li key={index} onClick={()=>toDetail(item)}>
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
                            <SendBox>Send</SendBox>

                            <img src={Next} alt=""/>
                        </FlexRht>

                    </div>

                </li>))
            }
        </ul>
    </Box>
}
