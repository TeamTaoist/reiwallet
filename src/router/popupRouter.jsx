import React from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Home from '../components/home-popup/home';
import Send from "../components/token/send";
import SendConfirm from "../components/token/sendConfirm";
import AccountDetail from "../components/account/Detail";
import Export from "../components/account/export";
import ExportConfirm from "../components/account/exportConfirm";
import AddToken from "../components/token/addToken";
import Setting from "../components/setting/setting";
import Language from "../components/setting/language";
import Security from "../components/setting/security";
import AccountMnemonic from "../components/setting/AccountMnemonic";
import AccountConfirm from "../components/setting/accountConfirm";
import PrivateKey from "../components/wallet/importWallet/privateKey";
import Success from "../components/wallet/createWallet/success";
import Step1 from "../components/wallet/createWallet/step1";
import Step2 from "../components/wallet/createWallet/step2";
import Step3 from "../components/wallet/createWallet/step3";
import Mnemonics from "../components/wallet/importWallet/Mnemonics";
import SendDetail from "../components/token/sendDetail";
import AssetDetail from "../components/token/assetDetail";


function PopupRouterLink() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Home />}/>
                <Route path="/step1" element={<Step1 />}/>
                <Route path="/step2" element={<Step2 />}/>
                <Route path="/step3" element={<Step3 />}/>
            <Route path="/detail" element={<AccountDetail />}/>
            <Route path="/export" element={<Export />}/>
            <Route path="/exportConfirm" element={<ExportConfirm />}/>
            <Route path="/addToken" element={<AddToken />}/>
            <Route path="/send" element={<Send />}/>
            <Route path="/sendConfirm" element={<SendConfirm />}/>
            <Route path="/setting" element={<Setting />}/>
            <Route path="/language" element={<Language />}/>
            <Route path="/security" element={<Security />}/>
            <Route path="/accountMnemonic" element={<AccountMnemonic />}/>
            <Route path="/accountConfirm" element={<AccountConfirm />}/>
            <Route path="/privatekey" element={<PrivateKey />}/>
            <Route path="/success" element={<Success />}/>
            <Route path="/mnemonics" element={<Mnemonics />}/>
            <Route path="/sendDetail" element={<SendDetail />}/>
            <Route path="/assetDetail" element={<AssetDetail />}/>
        </Routes>
   );
}

export default PopupRouterLink;
