// dashboard layout
import React from "react";
import styled from "styled-components";
import TwitterSvg from "../svg/social/twitter";
import DiscordSvg from "../svg/social/discord";
import TelegramSvg from "../svg/social/telegram";
import MediumSvg from "../svg/social/medium";
import Logo from "../../assets/images/dashboard/logo.png";
import { ChevronRight } from "lucide-react";
import i18n from "i18next";

const DashboardLayoutStyled = styled.div`
  padding-top: 70px;
  padding-bottom: 52px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;
const LayoutHeaderStyled = styled.div`
  height: 60px;
  padding: 0 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: 60px;
  }
  .rht {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    span {
      margin-bottom: 1px;
    }
  }
`;

const LayoutFooterStyled = styled.div`
  padding: 0 100px;
`;

const LayoutContainerStyled = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 85%;
  background-repeat: no-repeat;
`;

const SocialIconStyled = styled.a`
  margin-right: 30px;
  &:hover {
    circle {
      fill: #00a25c;
    }
  }
`;

const DashboardLayout = (props) => {
  const handleLan = () => {
    const lang = i18n.language === "zh" ? "en" : "zh";
    i18n.changeLanguage(lang);
  };

  return (
    <DashboardLayoutStyled className="regular-font">
      <LayoutHeaderStyled>
        <img src={Logo} alt="" />
        <div className="rht">
          <span onClick={() => handleLan()}>
            {i18n.language === "zh" ? "中文" : "English"}
          </span>
          <ChevronRight />
        </div>
      </LayoutHeaderStyled>
      <LayoutContainerStyled>{props.children}</LayoutContainerStyled>
      <LayoutFooterStyled>
        <SocialIconStyled href="">
          <TwitterSvg />
        </SocialIconStyled>
        <SocialIconStyled href="">
          <DiscordSvg />
        </SocialIconStyled>
        <SocialIconStyled href="https://t.me/reiwallet">
          <TelegramSvg />
        </SocialIconStyled>
        <SocialIconStyled href="">
          <MediumSvg />
        </SocialIconStyled>
      </LayoutFooterStyled>
    </DashboardLayoutStyled>
  );
};

export default DashboardLayout;
