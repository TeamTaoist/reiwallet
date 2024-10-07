import styled from "styled-components";

import widget from "@stealthex-io/widget";
import { useEffect } from "react";
import TokenHeader from "../header/tokenHeader";
import { useTranslation } from "react-i18next";
import Loading from "../loading/loading";

const BoxOuter = styled.div`
  position: relative;
  display: flex;
`;

const Box = styled.div`
  width: 94vw;
  position: absolute;
  left: 3vw;
  top: 80px;
  z-index: 9;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export default function Exchange() {
  const { t } = useTranslation();
  useEffect(() => {
    widget.init("18fca308-6858-422e-8897-245c2dc72039", { size: 382 });

    const iframe = document.getElementsByTagName("iframe")[0];
    console.log("iframeiframe", iframe);
    const loader = document.getElementById("loader");

    iframe.onload = function () {
      loader.style.display = "none"; // 隐藏 loading
      iframe.style.display = "block"; // 显示 iframe
    };
  }, []);

  return (
    <BoxOuter>
      <TokenHeader title={t("popup.Swap")} />
      <Box>
        <div id="stealthex-widget-container"></div>
        <div id="loader">
          <Loading showBg={true} />
        </div>
      </Box>
    </BoxOuter>
  );
}
