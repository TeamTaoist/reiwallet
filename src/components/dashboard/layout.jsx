// dashboard layout
import React from "react";
import styled from "styled-components";
import TwitterSvg from "../svg/social/twitter"
import DiscordSvg from "../svg/social/discord"
import TelegramSvg from "../svg/social/telegram"
import MediumSvg from "../svg/social/medium";
import Logo from '../../assets/images/dashboard/logo.png';

const DashboardLayoutStyled = styled.div`
  padding-top: 70px;
  padding-bottom: 52px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height:100vh;
`;
const LayoutHeaderStyled = styled.div`
  height: 60px;
  padding: 0 100px;
  img {
    height: 60px;
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
      fill: #00A25C;
    }
  }
`


const DashboardLayout = (props) => {
    return (
    <DashboardLayoutStyled className="regular-font">
      <LayoutHeaderStyled>
        <img src={Logo} alt="" />
      </LayoutHeaderStyled>
      <LayoutContainerStyled>{props.children}</LayoutContainerStyled>
      <LayoutFooterStyled>
        <SocialIconStyled href=""><TwitterSvg /></SocialIconStyled>
        <SocialIconStyled href=""><DiscordSvg /></SocialIconStyled>
        <SocialIconStyled href="https://t.me/reiwallet"><TelegramSvg /></SocialIconStyled>
        <SocialIconStyled href=""><MediumSvg /></SocialIconStyled>
      </LayoutFooterStyled>
    </DashboardLayoutStyled>
  );
};

export default DashboardLayout;
