import NavHeader from "../../header/navHeader";
import CreateHeader from "./createHeader";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import RefreshImg from "../../../assets/images/create/refresh.png";
import Button from "../../button/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CopyImg from "../../../assets/images/create/COPY.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Toast from "../../modal/toast";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainBox = styled.div`
  padding: 0 20px;
  flex-grow: 1;
  position: relative;
`;

const ContentBox = styled.div`
  min-height: 130px;
  background: #f1fcf1;
  border-radius: 14px;
  padding: 21px 5px 20px 25px;
  margin: 20px auto 10px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  span {
    padding: 0 17px 10px 0;
  }
  .download {
    width: 24px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    img {
      width: 100%;
    }
  }
`;
const RefreshBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #0054ff;
  line-height: 20px;
  margin-top: 14px;
  cursor: pointer;
  img {
    width: 24px;
    margin-right: 4px;
  }
`;
const BtmBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 20px;
  width: 100%;
`;

const CreateBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopyBox = styled.div`
  position: relative;
`;
const StrBox = styled.div`
  display: flex;
  align-items: center;
`;

export default function Step2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mnemonicStr] = useState([]);
  const [copied, setCopied] = useState(false);

  // useEffect(()=>{
  //     // if(accountMnemonic!=null){
  //     //     setMnemonicStr(accountMnemonic)
  //     // }else{
  //     //     init();
  //     // }
  //
  //     init();
  //
  // },[]);
  //
  // const init = () =>{
  //     // const wallet = ethers.Wallet.createRandom();
  //     // const { mnemonic:{ phrase}} = wallet;
  //     // const mnemonicArr = phrase.split(' ');
  //     // setMnemonicStr(mnemonicArr);
  // }

  const submit = () => {
    navigate("/step3");
  };

  const refresh = () => {
    // init();
  };

  const Copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Box>
      <NavHeader title={t("popup.createTitle")} />
      <CreateHeader
        title={t("popup.step2.subTitle")}
        step="2/3"
        tips={t("popup.step2.tips")}
      />
      <MainBox>
        <ContentBox className="regular-font">
          {mnemonicStr.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </ContentBox>
        <CreateBox>
          <RefreshBox onClick={() => refresh()}>
            <img src={RefreshImg} alt="" /> Refresh
          </RefreshBox>
          <CopyBox>
            <Toast tips="copied" left="" bottom="-40" show={copied} />
            <CopyToClipboard onCopy={() => Copy()} text={mnemonicStr.join(" ")}>
              <StrBox>
                <img src={CopyImg} alt="" /> Copy to Clipboard
              </StrBox>
            </CopyToClipboard>
          </CopyBox>
        </CreateBox>

        <BtmBox>
          <Button fullWidth primary onClick={() => submit()}>
            {t("popup.step2.Next")}
          </Button>
        </BtmBox>
      </MainBox>
    </Box>
  );
}
