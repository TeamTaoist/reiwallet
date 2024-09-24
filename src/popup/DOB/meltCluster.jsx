import styled from "styled-components";
import Button from "../button/button";
import useMessage from "../../hooks/useMessage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAccountAddress from "../../hooks/useAccountAddress";
import BtnLoading from "../loading/btnLoading";
import Toast from "../modal/toast";
import { useTranslation } from "react-i18next";

const Mask = styled.div`
  .bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
  }
`;
const Box = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80vw;
  box-sizing: border-box;
  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
`;
const BtnGroup = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  button {
    width: 47%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    &:disabled {
      opacity: 0.3;
    }
  }
`;

const TitleBox = styled.div`
  font-size: 16px;
  .top {
    font-family: "AvenirNext-Medium";
    font-weight: 500;
  }
  .sub {
    color: #c9233a;
    margin-top: 10px;
    font-size: 12px;
    text-transform: uppercase;
  }
`;
export default function MeltCluster({ handleClose, cluster }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tips, setTips] = useState("");
  const navigate = useNavigate();
  const { currentAccountInfo } = useAccountAddress();

  const { t } = useTranslation();

  const handleEvent = (message) => {
    const { type } = message;
    switch (type) {
      case "melt_cluster_success":
        {
          setError(true);
          setTips("Melt Finished");
          setTimeout(() => {
            setError(false);
            navigate(`/home?tab=0`);
            handleClose();
          }, 2000);
        }
        break;
      case "melt_cluster_error":
        {
          setTips("Melt Failed:" + message.data);
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(false);
            navigate("/home");
          }, 2000);
        }
        break;
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  const closeMelt = () => {
    handleClose();
  };
  const confirm = () => {
    setLoading(true);
    console.log("cluster", cluster);
    let obj = {
      method: "melt_cluster",
      outPoint: cluster.out_point,
      currentAccountInfo,
    };

    sendMsg(obj);
  };
  return (
    <>
      <Mask>
        <Toast tips={tips} size={20} show={error} />
        <div className="bg">
          <Box>
            <div className="inner">
              <TitleBox>
                <div className="top">{t("popup.dob.meltClusterTips")}</div>

                <div className="sub">{t("popup.dob.meltTips2")}</div>
              </TitleBox>
              <BtnGroup>
                <Button border onClick={() => closeMelt()}>
                  {t("popup.dob.Cancel")}
                </Button>
                <Button primary disabled={loading} onClick={() => confirm()}>
                  {t("popup.dob.MELT")}
                  {loading && <BtnLoading />}
                </Button>
              </BtnGroup>
            </div>
          </Box>
        </div>
      </Mask>
    </>
  );
}
