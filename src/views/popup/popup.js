import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import "../../assets/css/font.css";
import "../../assets/css/globals.css";
import { HashRouter as Router } from "react-router-dom";
import PopupRouterLink from "../../router/popupRouter";
import "../../i18n/i18";
import { Web3ContextProvider } from "../../store/contracts";
import * as Sentry from "@sentry/react";

const Box = styled.div`
  width: 382px;
`;

Sentry.init({
  dsn: "https://138dedc0535aa4495a3c4e70a88552bb@o4507175892353024.ingest.us.sentry.io/4507983863218176",
  integrations: [Sentry.replayIntegration()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
