import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../popup/homePopup/home";
import Send from "../popup/token/send";
import SendAction from "../popup/token/sendAction";
import AccountDetail from "../popup/account/detail";
import Sites from "../popup/site/sites";

import Export from "../popup/account/export";
import ExportConfirm from "../popup/account/exportConfirm";
import Setting from "../popup/setting/setting";
import Language from "../popup/setting/language";
import Security from "../popup/setting/security";
import AccountMnemonic from "../popup/setting/accountMnemonic";
import AccountConfirm from "../popup/setting/accountConfirm";
import PrivateKey from "../popup/wallet/importWallet/privateKey";
import Success from "../popup/wallet/createWallet/success";
import Step1 from "../popup/wallet/createWallet/step1";
import Step2 from "../popup/wallet/createWallet/step2";
import Step3 from "../popup/wallet/createWallet/step3";
import Mnemonics from "../popup/wallet/importWallet/mnemonics";
import AssetDetail from "../popup/SUDT/assetDetail";
import AddNetwork from "../popup/network/addNetwork";
import DOBDetail from "../popup/DOB/detail";
import ClusterDetail from "../popup/DOB/clusterDetail";
import DOBConfirm from "../popup/DOB/confirm";
import SendConfirm from "../popup/SUDT/sendConfirm";
import ClusterConfirm from "../popup/DOB/clusterConfirm";
import SUDTDetail from "../popup/SUDT/sudtDetail";
import XUDTDetail from "../popup/xudt/xudtDetail";
import SendXUDTConfirm from "../popup/xudt/sendXUDTConfirm";

function PopupRouterLink() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/step1" element={<Step1 />} />
      <Route path="/step2" element={<Step2 />} />
      <Route path="/step3" element={<Step3 />} />
      <Route path="/detail" element={<AccountDetail />} />
      <Route path="/sites" element={<Sites />} />

      <Route path="/export" element={<Export />} />
      <Route path="/exportConfirm" element={<ExportConfirm />} />

      <Route path="/send" element={<Send />} />
      <Route path="/sendDOB" element={<Send />} />
      <Route path="/sendCluster" element={<Send />} />
      <Route path="/sendSUDT" element={<Send />} />
      <Route path="/sendXUDT" element={<Send />} />

      <Route path="/sendStep1" element={<SendAction />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/language" element={<Language />} />
      <Route path="/security" element={<Security />} />
      <Route path="/accountMnemonic" element={<AccountMnemonic />} />
      <Route path="/accountConfirm" element={<AccountConfirm />} />
      <Route path="/privatekey" element={<PrivateKey />} />
      <Route path="/success" element={<Success />} />
      <Route path="/mnemonics" element={<Mnemonics />} />
      <Route path="/assetDetail" element={<AssetDetail />} />
      <Route path="/addNetwork" element={<AddNetwork />} />

      <Route path="/dobDetail" element={<DOBDetail />} />
      <Route path="/dobConfirm" element={<DOBConfirm />} />
      <Route path="/clusterConfirm" element={<ClusterConfirm />} />
      <Route path="/ClusterDetail" element={<ClusterDetail />} />

      <Route path="/sudtConfirm" element={<SendConfirm />} />

      <Route path="/sudtDetail" element={<SUDTDetail />} />
      <Route path="/xudtDetail" element={<XUDTDetail />} />
      <Route path="/xudtConfirm" element={<SendXUDTConfirm />} />
    </Routes>
  );
}

export default PopupRouterLink;
