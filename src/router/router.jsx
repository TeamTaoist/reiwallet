import React from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Privacy from '../components/privacy/privacy';
import SetPassword from "../components/wallet/createIdentity/setPassword";
import Mnemonics from "../components/wallet/createIdentity/mnemonics";
import Download from "../components/wallet/createIdentity/download";
import Restore from "../components/wallet/createIdentity/restore";
import Confirmation from '../components/wallet/createIdentity/Confirmation'
import Success from "../components/wallet/createIdentity/success";

function RouterLink() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/privacy" />}/>
            <Route path="/privacy" element={<Privacy />}/>
            <Route path="/create" element={<SetPassword />}/>
            <Route path="/mnemonics" element={<Mnemonics />}/>
            <Route path="/download" element={<Download />}/>
            <Route path="/restore" element={<Restore />}/>
            <Route path="/success" element={<Success />}/>
            <Route path="/confirmation" element={<Confirmation />}/>
        </Routes>
   );
}

export default RouterLink;
