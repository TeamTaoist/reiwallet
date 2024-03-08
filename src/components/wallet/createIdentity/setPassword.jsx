import DashboardLayout from "../../dashboard/layout";
import {useNavigate} from "react-router-dom";
import Button from "../../button/button";
import ContainerLayout,{ContainerTitle} from "../../dashboard/container_layout";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useWeb3} from "../../../store/contracts";
import Keystore from "../../../wallet/keystore";


const ContainerContentStyled = styled.div`
  position: relative;
  .sub-title{
    margin-right:5px;
  }
`


const ContentBox = styled.div`
    margin-top: 50px;
    .titleTips{
        font-size: 12px;
        color: #97A0C3;
        line-height: 16px;
        letter-spacing: 2px;
    }
    .inputBox{
      margin-top: 15px;
    }
    .liBox{
        margin-bottom: 20px;
    }
`

export default function SetPassword(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [pwd, setPwd] = useState('');
    const [cm_pwd, setCm_pwd] = useState('');
    const {dispatch} = useWeb3();
    //
    // useEffect(() => {
    //
    //
    //     const key =  Keystore.create("123456","0xD85c413dA833CeBD8338138CcEFA04979DF70E8e")
    //     console.log(key)
    // }, []);

    const next = () =>{
        dispatch({type:"SET_PASSWORD",payload:pwd});
        navigate('/mnemonics');
    }

    const handleInput = (e) =>{
        const { value,name } = e.target;
        if(name === "password"){
            setPwd(value)
        }else{
            setCm_pwd(value)
        }
    }
    return <DashboardLayout>
        <ContainerLayout
            button={
                <Button primary fullWidth onClick={()=>next()} disabled={!pwd?.length || cm_pwd !== pwd }>{t('install.create.create.next')}</Button>
            }
        >
            <ContainerContentStyled>

                <ContainerTitle
                    title={t('install.create.create.create_title')}
                    subTitle=""
                />
                <ContentBox>
                    {/*<div className="liBox">*/}
                    {/*    <div className="titleTips regular-font">*/}
                    {/*        {t('install.create.create.walletName')}*/}
                    {/*    </div>*/}
                    {/*    <div className="inputBox">*/}
                    {/*        <input type="text" value={identity} placeholder={t('install.create.create.namePlaceholder')} onChange={(e) => handleInput(e)}/>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
                    <div className="liBox">
                        <div className="titleTips regular-font">
                            {t('install.create.create.pwd')}
                        </div>
                        <div className="inputBox">
                            <input type="password" name="password" value={pwd}  placeholder={t('install.create.create.pwdPlaceholder')} onChange={(e) => handleInput(e)}/>
                        </div>

                    </div>
                    <div className="liBox">
                        <div className="titleTips regular-font">
                            {t('install.create.create.confirmPwd')}
                        </div>
                        <div className="inputBox">
                            <input type="password" name="confirm_password" value={cm_pwd} placeholder={t('install.create.create.confirmPlaceholder')} onChange={(e) => handleInput(e)}/>
                        </div>

                    </div>

                </ContentBox>
            </ContainerContentStyled>
        </ContainerLayout>
    </DashboardLayout>
}
