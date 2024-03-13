import styled from "styled-components";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "../button/button";
import useWalletList from "../../useHook/useWalletList";
import useNetwork from "../../useHook/useNetwork";
import {useNavigate} from "react-router-dom";
import {useWeb3} from "../../store/contracts";
import BtnLoading from "../btnloading";
import useMessage from "../../useHook/useMessage";

const MaskBox = styled.div`
    background: rgba(0,0,0,0.4);
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    
`

const BgBox = styled.div`
  width:90%;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px 0px #EDEDED;
  border-radius: 14px!important;
  display: flex;
  flex-direction: column;
    overflow: hidden;
`
const TitleBox = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #34332E;
  line-height: 20px;
  height: 62px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
`

const ContentBox = styled.div`
    padding: 0 20px;
    .inputBox{
        margin-top: 15px;
    }
    .liBox{
        margin-bottom: 20px;
    }
  `
const BtnGroup = styled.div`

    display: flex;
    width:100%;
    justify-content: space-between;
    background: #fff;
    padding: 0  20px 20px;
    box-sizing: border-box;
    button{
      width: 49%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap:5px;
        &:disabled{
            opacity: 0.3;
        }
    }
    
`

export default function AddAccount({handleCloseNew}) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const {walletList} = useWalletList();
    const {network} = useNetwork();
    const {state:{refresh_wallet_list},dispatch} = useWeb3();
    const[loading,setLoading] = useState(false)
    const handleEvent = (message) => {
        const {type }= message
        if(type==="to_lock"){
            navigate('/');
        }else if(type ==="create_account_success"){
            setLoading(false)
            dispatch({type:'SET_WALLET_LIST',payload:!refresh_wallet_list});
            handleCloseNew()

        }
    }
    const {sendMsg} = useMessage(handleEvent,[]);

    useEffect(() => {
        let str = `Account ${walletList.length+1}`
        setName(str)
    }, [walletList]);
    const handleInput = (e) => {
        const {value} = e.target;
        setName(value)
    }


    const handleCreate = () =>{
        setLoading(true)
        let obj ={
            index:walletList.length,
            network,
            name,
            hasMnemonic:true,
            method:"Create_Account"
        }
        sendMsg(obj)
    }

    return <MaskBox>
        <BgBox>
            <TitleBox className="medium-font">Add Account</TitleBox>
            <ContentBox>
                <div className="liBox">
                    <div className="titleTips regular-font">
                        Account Name
                    </div>
                    <div className="inputBox">
                        <input type="text" value={name}
                               placeholder={t('install.create.create.pwdPlaceholder')}
                               onChange={(e) => handleInput(e)}/>
                    </div>

                </div>
            </ContentBox>
            <BtnGroup>
                <Button black onClick={()=>handleCreate()} disabled={!name?.length || loading}>{t('popup.switch.Create')}
                    {
                    loading && <BtnLoading/>
                }
                </Button>
                <Button border onClick={()=>handleCloseNew()}>Cancel</Button>
            </BtnGroup>
        </BgBox>

    </MaskBox>
}
