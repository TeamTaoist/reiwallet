import React from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Home from '../components/home-popup/home';


function PopupRouterLink() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />}/>
            <Route path="/home" element={<Home />}/>

        </Routes>
   );
}

export default PopupRouterLink;
