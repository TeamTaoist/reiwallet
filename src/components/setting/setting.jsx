import styled from "styled-components";
import CloseImg from "../../assets/images/close.png";
import {useNavigate} from "react-router-dom";
import Twitter from "../../assets/images/setting/Twitter.png";
import Discord from "../../assets/images/setting/Discord.png";
import Telegram from "../../assets/images/setting/Telegram.png";
import Medium from "../../assets/images/setting/Medium.png";
import Next from '../../assets/images/into.png'
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import HasteImg from "../../assets/images/setting/haste-logo.png"


const Box = styled.div`
    width: 100%;
  height: 100vh;
  background: #F9FAFA;
  box-shadow: 0px 0px 8px 0px #E8E8E8;
  padding: 20px;
  display: flex;
  flex-direction: column;
  
`

const TitleBox = styled.div`
    padding-bottom: 24px;
    display: flex;
    align-items: center;
    img{
      width: 24px;
      cursor: pointer;
    }
    .title{
      margin-right: 24px;
      text-align: center;
      width: 100%;
      font-size: 18px;
      color: #34332E;
      line-height: 20px;
    }
`

const ContentBox = styled.div`
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 0px rgba(234, 234, 234, 0.66);
  border-radius: 14px;
  padding: 26px 20px;
`
const Titles = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #34332E;
  line-height: 20px;
  margin: 20px 0 10px;
`

const LinkBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    img{
      width: 28px;
      margin-right: 29px;
        cursor: pointer;
    }
`
const LinkBox2= styled.ul`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    li{
        display: flex;
        align-items: center;
        font-size: 16px;
        //border-bottom: 1px solid #eee;
        //width: 100%;
        //padding-bottom: 10px;
    }
    img{
      width: 28px;
      margin-right: 10px;
        cursor: pointer;
    }
`
const ItemBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rht{
      display: flex;
      align-items: center;
      img{
        width: 24px;
      }
    }
`
const ContentBox2 = styled(ContentBox)`
  padding: 0 20px;
`
const ItemBox2 = styled(ItemBox)`
    height:52px;
    border-bottom: 1px solid rgba(136, 151, 177, 0.2);
  &:last-child{
    border-bottom: 0;
  }
`
const LftTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #8B97AF;
  line-height: 20px;
`

const FirstLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  .hi{
    font-size: 18px;
    font-weight: 500;
    color: #34332E;
    line-height: 20px;
  }
  .name{
    font-size: 20px;
    font-family: "AvenirNext-Bold";
    color: #34332E;
    line-height: 20px;
    padding: 10px 0 5px;
    img{
      margin-left: 9px;
    }
  }
  .address{
    font-size: 14px;
    font-weight: 500;
    color: #A5ACBF;
    line-height: 20px;
    display: flex;
    align-items: center;
    img{
      margin:-2px  0 0 5px;
    }
  }
`

const SocialBox = styled.ul`
    margin-top: 23px;
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      &:last-child{
        margin-bottom: 0;
      }
      .lft,.rht{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .lft{
        font-size: 12px;
        font-weight: 500;
        color: #1D2F5D;
        line-height: 16px;
        img{
          width: 24px;
          margin-right: 9px;
        }
      }
      .rht{
        span{
          margin-right: 6px;
        }
      }
      .avatar{
        width: 24px;
        height: 24px;
        margin-right: 9px;
        border-radius: 24px;
      }
    }
`

export default function Setting(){
    const navigate = useNavigate()
    const { t,i18n } = useTranslation();
    const [version,setVersion] = useState('')

    const toGo = (url) =>{
        navigate(url)
    }

    const toTab = (url) =>{
        /*global chrome*/
        chrome.tabs.create({
            url
        });
    }

    useEffect(() => {
        getVersion();

    }, []);

    const getVersion = () =>{
        /*global chrome*/
        const manifest = chrome.runtime.getManifest();
        console.log("=manifest.version==",manifest)
        setVersion(manifest.version)
    }


    const handleLan = () =>{

        const lang = i18n.language === "zh" ? "en":"zh"
        i18n.changeLanguage(lang);

    }

    return <Box>
        <TitleBox>
            <img src={CloseImg} alt="" onClick={() => toGo('/')}/>
            <div className="title medium-font">{t('popup.Settings.More')}</div>
        </TitleBox>

        <div>
            <Titles className="medium-font">{t('popup.Settings.General')}</Titles>
            <ContentBox2>
                {/*<ItemBox2  onClick={()=>toGo('/language')}>*/}
                <ItemBox2 onClick={()=>handleLan()}>
                    <LftTitle className="medium-font">{t('popup.Settings.Language')}</LftTitle>
                    <div className="rht">

                        <span>{i18n.language === "zh"?"中文":"English"}</span>
                        <img src={Next} alt=""/>
                    </div>
                </ItemBox2>
                <ItemBox2 onClick={() => toGo('/security')}>
                    <LftTitle className="medium-font">{t('popup.Settings.Security')}</LftTitle>
                    <div className="rht">
                        <img src={Next} alt=""/>
                    </div>
                </ItemBox2>
            </ContentBox2>
        </div>
        <div>
            <Titles className="medium-font">{t('popup.Settings.About')}</Titles>
            <ContentBox2>
                <ItemBox2>
                    <LftTitle className="medium-font">{t('popup.Settings.Version')}</LftTitle>
                    <div>V {version}</div>
                </ItemBox2>
                <ItemBox2 onClick={() => toTab('/install.html#/privacy')}>
                    <LftTitle className="medium-font">{t('popup.Settings.Privacy')}</LftTitle>
                    <div className="rht">
                        <img src={Next} alt=""/>
                    </div>
                </ItemBox2>
            </ContentBox2>
        </div>
        <div>
            <Titles className="medium-font">{t('popup.Settings.Contact')}</Titles>
            <LinkBox>
                {/*<img src={Twitter} alt=""/>*/}
                {/*<img src={Discord} alt=""/>*/}
                <img src={Telegram} alt="" onClick={() => toTab("https://t.me/reiwallet")}/>

                {/*<img src={Medium} alt=""/>*/}
            </LinkBox>
        </div>
        <div>
            <Titles className="medium-font">{t('popup.Settings.Friendly')}</Titles>
            <LinkBox2>

                <li>
                    <img src={HasteImg} alt="" onClick={() => toTab("https://haste.pro")}/>
                    <span>Haste.pro</span>
                </li>
            </LinkBox2>
        </div>
    </Box>
}
