import {createRoot} from "react-dom/client";
import React from "react";
import '../../assets/css/font.css';
import '../../assets/css/globals.css';
import { HashRouter as Router } from 'react-router-dom'
import RouterLink from "../../router/router";
import '../../i18n/i18';


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<div>

        <Router>
            <RouterLink />
        </Router>

</div>);
