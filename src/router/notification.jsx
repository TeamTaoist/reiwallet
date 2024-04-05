import React from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Home from "../notification/sign/home";
import Send from "../notification/send/send";
import SendDOB from "../notification/send/sendDOB";
import SendCluster from "../notification/send/sendCluster";
import Grant from "../notification/grant/grant";

function RouterLink() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/send" element={<Send />}/>
            <Route path="/grant" element={<Grant />}/>
            <Route path="/sendDOB" element={<SendDOB />}/>
            <Route path="/sendCluster" element={<SendCluster />}/>

        </Routes>
    );
}

export default RouterLink;
