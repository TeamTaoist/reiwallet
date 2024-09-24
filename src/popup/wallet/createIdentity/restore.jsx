import DashboardLayout from "../../dashboard/layout";
import { useNavigate } from "react-router-dom";
import Button from "../../button/button";
import ContainerLayout, {
  ContainerTitle,
} from "../../dashboard/containerLayout";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import TipImg from "../../../assets/images/create/tip.png";
import { useState } from "react";
import Wallet from "../../../wallet/wallet";
import { useWeb3 } from "../../../store/contracts";
import BtnLoading from "../../loading/btnLoading";

const ContainerContentStyled = styled.div`
  .title {
    margin-right: 100px;
  }
`;

const Box = styled.div`
  .inputBox {
    margin: 20px 0;
    min-height: 120px;
    textarea {
      padding: 20px 25px 20px;
      min-height: 120px;
      width: 100%;
      box-sizing: border-box;
      background: transparent;
      border: 0;
      line-height: 2em;
      color: #666;
      &:focus {
        outline: none;
      }
    }
  }
  span {
    padding: 0 20px 10px 0;
  }
`;
const AlertTips = styled.div`
  display: flex;
  align-items: flex-start;

  font-size: 14px;
  color: #242f57;
  line-height: 20px;
  padding-right: 10px;
  img {
    width: 24px;
    margin-right: 7px;
  }
`;

export default function Restore() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mnemonicImport, setMnemonicImport] = useState("");
  const { dispatch } = useWeb3();

  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { value } = e.target;
    setMnemonicImport(value);
  };

  const confirm = async () => {
    setLoading(true);
    let mnemonicArr = mnemonicImport.trim().split(/\s+/);
    const mnemonicStr = mnemonicArr.join(" ");

    const wallet = new Wallet(0, true, false, mnemonicStr);
    let walletObj = await wallet.GenerateWallet();
    const { address_main, address_test, publicKey } = walletObj;

    dispatch({ type: "SET_MNEMONIC", payload: mnemonicArr });
    dispatch({ type: "SET_IMPORT_MNEMONIC", payload: "importMnemonic" });
    dispatch({
      type: "SET_ACCOUNT",
      payload: { address_main, address_test, publicKey },
    });
    setLoading(false);
    navigate("/confirmation");
  };

  return (
    <DashboardLayout>
      <ContainerLayout
        button={
          <Button
            className="import"
            primary
            fullWidth
            onClick={() => confirm()}
          >
            Confirm {loading && <BtnLoading />}
          </Button>
        }
      >
        <ContainerContentStyled>
          <ContainerTitle
            title={t("install.create.restore.title")}
            subTitle={t("install.create.restore.tips")}
          />
          <Box>
            <div className="inputBox">
              <textarea
                name=""
                value={mnemonicImport}
                onChange={(e) => handleInput(e)}
              ></textarea>
            </div>
          </Box>
          <AlertTips className="regular-font">
            <img src={TipImg} alt="" />
            {t("install.create.restore.enterTips")}
          </AlertTips>
        </ContainerContentStyled>
      </ContainerLayout>
    </DashboardLayout>
  );
}
