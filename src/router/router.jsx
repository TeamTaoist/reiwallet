import React from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Privacy from '../components/privacy/privacy';


function RouterLink() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/privacy" />}/>
            <Route path="/privacy" element={<Privacy />}/>

        </Routes>
   );
}

export default RouterLink;
