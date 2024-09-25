import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import "../../assets/css/font.css";
import "../../assets/css/globals.css";
import { HashRouter as Router } from "react-router-dom";
import PopupRouterLink from "../../router/popupRouter";
import "../../i18n/i18";
import { Web3ContextProvider } from "../../store/contracts";

const Box = styled.div`
  width: 382px;
`;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Box>
    <Web3ContextProvider>
      <Router>
        <PopupRouterLink />
      </Router>
    </Web3ContextProvider>
  </Box>,
);
