import styled from "styled-components";
import CloseImg from "../../assets/images/close.png";
import {useNavigate} from "react-router-dom";
import Twitter from "../../assets/images/setting/Twitter.png";
import Discord from "../../assets/images/setting/Discord.png";
import Telegram from "../../assets/images/setting/Telegram.png";
import Medium from "../../assets/images/setting/Medium.png";
import Next from '../../assets/images/into.png'


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

    const toGo = (url) =>{
        navigate(url)
    }

    const toPrivacy = () =>{
        /*global chrome*/
        chrome.tabs.create({
            url: '/install.html#/privacy'
        });
    }
    return <Box>
        <TitleBox>
            <img src={CloseImg} alt="" onClick={()=>toGo('/')}/>
            <div className="title medium-font">More</div>
        </TitleBox>

        <div>
            <Titles className="medium-font">General</Titles>
            <ContentBox2>
                {/*<ItemBox2  onClick={()=>toGo('/language')}>*/}
                <ItemBox2 >
                    <LftTitle className="medium-font">Language switching</LftTitle>
                    <div className="rht">
                        <span>English</span>
                        <img src={Next} alt=""/>
                    </div>
                </ItemBox2>
                {/*<ItemBox2  onClick={()=>toGo('/security')}>*/}
                <ItemBox2 >
                    <LftTitle className="medium-font">Security and privacy</LftTitle>
                    <div className="rht">
                        <img src={Next} alt=""/>
                    </div>
                </ItemBox2>
            </ContentBox2>
        </div>
        <div>
            <Titles className="medium-font">About</Titles>
            <ContentBox2>
                <ItemBox2>
                    <LftTitle className="medium-font">Version number</LftTitle>
                    <div>V 1.0</div>
                </ItemBox2>
                <ItemBox2 onClick={() => toPrivacy()}>
                    <LftTitle className="medium-font">Privacy clause</LftTitle>
                    <div className="rht">
                        <img src={Next} alt=""/>
                    </div>
                </ItemBox2>
            </ContentBox2>
        </div>
        <div>
            <Titles className="medium-font">Contact US</Titles>
            <LinkBox>
                <img src={Twitter} alt=""/>
                <img src={Discord} alt=""/>
                <img src={Telegram} alt=""/>
                <img src={Medium} alt=""/>
            </LinkBox>
        </div>
    </Box>
}
