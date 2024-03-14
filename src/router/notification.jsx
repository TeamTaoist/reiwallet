import React from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Password from "../notification/password";


function RouterLink() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/password" />}/>
            <Route path="/password" element={<Password />}/>
        </Routes>
    );
}

export default RouterLink;
