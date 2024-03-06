import DashboardLayout from "../../dashboard/layout";
import {useNavigate} from "react-router-dom";
import Button from "../../button/button";
import ContainerLayout,{ContainerTitle} from "../../dashboard/container_layout";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import {useState} from "react";


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

export default function CreateIdentity(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [identity, setIdentity] = useState('');

    const next = () =>{
        /*global chrome*/
        chrome.storage.local.set({identity});
        navigate('/mnemonics');
    }

    const handleInput = (e) =>{
        const { value } = e.target;
        setIdentity(value);
    }
    return <DashboardLayout>
        <ContainerLayout
            button={
                <Button primary fullWidth onClick={()=>next()} disabled={!identity.length}>{t('install.create.create.next')}</Button>
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
                            <input type="text" value={identity}  placeholder={t('install.create.create.pwdPlaceholder')} onChange={(e) => handleInput(e)}/>
                        </div>

                    </div>
                    <div className="liBox">
                        <div className="titleTips regular-font">
                            {t('install.create.create.confirmPwd')}
                        </div>
                        <div className="inputBox">
                            <input type="text" value={identity} placeholder={t('install.create.create.confirmPlaceholder')} onChange={(e) => handleInput(e)}/>
                        </div>

                    </div>

                </ContentBox>
            </ContainerContentStyled>
        </ContainerLayout>
    </DashboardLayout>
}
