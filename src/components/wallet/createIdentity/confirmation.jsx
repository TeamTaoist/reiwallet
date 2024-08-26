import DashboardLayout from "../../dashboard/layout";
import { useNavigate } from "react-router-dom";
import Button from "../../button/button";
import ContainerLayout, {
  ContainerTitle,
} from "../../dashboard/containerLayout";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import ClearImg from "../../../assets/images/clear.png";
import { useWeb3 } from "../../../store/contracts";
import PublicJs from "../../../utils/publicJS";
import Keystore from "../../../wallet/keystore";
import Loading from "../../loading/loading";
import useNetwork from "../../../useHook/useNetwork";
import useCurrentAccount from "../../../useHook/useCurrentAccount";
import useWalletList from "../../../useHook/useWalletList";
import { savePassword } from "../../../wallet/password";

const ContainerContentStyled = styled.div``;
const ContentBox = styled.div`
  .inputBox {
    margin: 20px 0;
    padding: 20px 25px 20px;
    min-height: 120px;

    & > div {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }
  span {
    padding: 0 20px 10px 0;
  }
`;
const SelectedBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -20px;
  span {
    margin: 0 0 10px 20px;
    padding: 6px 10px;
    background: #fcfefa;
    border-radius: 10px;
    border: 1px solid #d2d5e1;
    cursor: pointer;
    &.active {
      background: #00ff9d;
      border-radius: 10px;
      border: 1px solid #00ff9d;
    }
  }
`;
const ClearBox = styled.div`
  margin: -5px auto 15px;
  display: flex;
  align-items: center;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #0054ff;
    line-height: 24px;
    padding: 0;
  }
  img {
    width: 24px;
    margin-left: 4px;
  }
`;
export default function Confirmation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dispatch, state } = useWeb3();
  const { mnemonic, password, account, importMnemonic } = state;
  const [list, setList] = useState([]);
  const [selectedArr, SetSelectedArr] = useState([]);
  const [activeArr, setActiveArr] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { saveNetwork } = useNetwork();
  const { saveCurrent } = useCurrentAccount();
  const { saveWallet } = useWalletList();

  useEffect(() => {
    if (mnemonic == null) return;
    const arr = PublicJs.randomSort(mnemonic);
    setList(arr);
    setActiveArr(Array(arr.length).fill(false));
    if (importMnemonic === "importMnemonic") {
      next();
    }
  }, [mnemonic, importMnemonic]);

  useEffect(() => {
    if (mnemonic == null) return;

    if (selectedArr.length !== mnemonic.length) {
      setDisabled(true);
      return;
    }
    const SelectedStr = selectedArr.join(" ");
    const MnemonicStr = mnemonic.join(" ");
    if (SelectedStr !== MnemonicStr) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  }, [selectedArr, mnemonic]);

  const next = async () => {
    setLoading(true);
    setTimeout(async () => {
      const MnemonicStr = mnemonic.join(" ");
      let newPassword = await savePassword(password);
      let keyJSon = Keystore.create(MnemonicStr, newPassword);
      /*global chrome*/
      chrome.storage.local.set({ isInit: true });
      saveWallet(
        {
          account,
          publicKey: account.publicKey,
          type: "create",
          name: "Account 1",
          account_index: 0,
        },
        "new",
      );
      chrome.storage.local.set({ Mnemonic: JSON.stringify(keyJSon) });
      saveNetwork("mainnet");
      saveCurrent(0);

      dispatch({ type: "SET_MNEMONIC", payload: null });
      dispatch({ type: "SET_PASSWORD", payload: null });

      navigate("/success");
      setLoading(false);
    }, 10);
  };
  const chooseSelect = (selected, index, status) => {
    if (status) return;
    const selectedLen = activeArr.filter((item) => item === true);
    if (selectedLen.length >= 12) return;

    let arr = [...selectedArr];
    arr.push(selected);
    SetSelectedArr(arr);

    let actArr = [...activeArr];
    actArr[index] = true;
    setActiveArr(actArr);
  };
  const clear = () => {
    setActiveArr([]);
    SetSelectedArr([]);
  };

  return (
    <DashboardLayout>
      {loading && <Loading showBg={true} />}

      <ContainerLayout
        button={
          <Button primary fullWidth onClick={() => next()} disabled={disabled}>
            {t("install.create.confirmation.Confirm")}
          </Button>
          // <Button primary fullWidth onClick={()=>next()}>{t('install.create.confirmation.Confirm')}</Button>
        }
      >
        <ContainerContentStyled>
          <ContainerTitle
            title={t("install.create.confirmation.title")}
            subTitle={t("install.create.confirmation.tips")}
          />
          <ContentBox>
            <div className="inputBox">
              <div>
                {selectedArr.map((item, index) => (
                  <span key={`select_${index}`}>{item}</span>
                ))}
              </div>
            </div>
            <ClearBox onClick={() => clear()}>
              <img src={ClearImg} alt="" />
              <span className="medium-font">Clear</span>
            </ClearBox>
            <SelectedBox>
              {list.map((item, index) => (
                <span
                  className={activeArr[index] ? "active" : ""}
                  key={`list_${index}`}
                  onClick={() => chooseSelect(item, index, activeArr[index])}
                >
                  {item}
                </span>
              ))}
            </SelectedBox>
          </ContentBox>
        </ContainerContentStyled>
      </ContainerLayout>
    </DashboardLayout>
  );
}
