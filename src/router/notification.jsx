import React from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Home from "../notification/sign/home";
import Send from "../notification/send/send";

function RouterLink() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/send" element={<Send />}/>

        </Routes>
    );
}

export default RouterLink;
