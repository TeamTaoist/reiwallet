import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Button from "../button/button";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Loading from "../loading/loading";
import useNetwork from "../../useHook/useNetwork";
import Toast from "../modal/toast";

const Box = styled.div`
  background: #F9FAFA;
    padding-bottom: 20px;
`

const ContentBox = styled.div`
    margin: 0 20px;
`
const BtnGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin:59px 20px 20px;
    button{
      width: 47%;
    }
`

const InputBox = styled.div`
    margin-top: 29px;
    span{
        color: #C9233A;
    }
  .titleTips{
    font-size: 12px;
    color: #97A0C3;
    line-height: 16px;
    letter-spacing: 2px;
    margin-bottom: 14px;
  }
  .inputBox{
    border: 1px solid #A1ADCF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover{
      border: 1px solid #000!important;
    }
  }
`

export default function AddNetwork(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name,setName] = useState("")
    const [decimals,setDecimals] = useState("")
    const [symbol,setSymbol] = useState("")
    const [explorer,setExplorer] = useState("")
    const [node,setNode] = useState("")
    const [indexer,setIndexer] = useState("")
    const [loading , setLoading] = useState(false);
    const {netList} = useNetwork();
    const [show,setShow] = useState(false);

    const toGo = () =>{
        navigate('/');
    }
    const submit = async()=>{
        setLoading(true)
        let obj={
            name,
            value:netList.length ?? 2,
            nativeCurrency: {
                symbol,
                decimals
            },
            rpcUrl:{
                node,
                indexer
            },
            blockExplorerUrls:explorer
        }

        /*global chrome*/

        let arr = [...netList,obj]
        chrome.storage.local.set({networkList:arr})

        setShow(true)
        navigate('/');
    }


    const handleInput = (e) =>{
        const { name,value } = e.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'decimals':
                setDecimals(value);
                break;
            case 'symbol':
                setSymbol(value);
                break;
            case 'explorer':
                setExplorer(value);
                break;
            case 'node':
                setNode(value);
                break;
            case 'indexer':
                setIndexer(value);
                break;
        }

    }

    return <Box>
        {
            loading && <Loading showBg={true} />
        }

        <Toast tips="Success" size={20} show={show}/>

        <TokenHeader title={t('popup.network.AddNetwork')} />
        <ContentBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.name')}<span>*</span></div>
                <div className="inputBox">
                    <input type="text" name="name" value={name} onChange={(e)=>handleInput(e)} />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.rpcURlNode')}<span>*</span></div>
                <div className="inputBox">
                    <input type="text" name="node" value={node} onChange={(e)=>handleInput(e)}   />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.rpcURlIndexer')}<span>*</span></div>
                <div className="inputBox">
                    <input type="text" name="indexer" value={indexer} onChange={(e)=>handleInput(e)}   />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.decimals')}</div>
                <div className="inputBox">
                    <input type="text" name="decimals" value={decimals} onChange={(e)=>handleInput(e)}  />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.symbol')}</div>
                <div className="inputBox">
                    <input type="text" name="symbol" value={symbol} onChange={(e)=>handleInput(e)}   />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.explorerUrl')}</div>
                <div className="inputBox">
                    <input type="text" name="explorer" value={explorer} onChange={(e)=>handleInput(e)}  />
                </div>
            </InputBox>

        </ContentBox>
        <BtnGroup>
            <Button border onClick={()=>toGo()}>{t('popup.network.cancel')}</Button>
            <Button primary onClick={()=>submit()}>{t('popup.network.save')}</Button>
        </BtnGroup>
    </Box>
}
