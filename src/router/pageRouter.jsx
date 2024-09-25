import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Privacy from "../popup/privacy/privacy";
import SetPassword from "../popup/wallet/createIdentity/setPassword";
import Mnemonics from "../popup/wallet/createIdentity/mnemonics";
import Download from "../popup/wallet/createIdentity/download";
import Restore from "../popup/wallet/createIdentity/restore";
import Confirmation from "../popup/wallet/createIdentity/confirmation";
import Success from "../popup/wallet/createIdentity/success";

function RouterLink() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/privacy" />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/create" element={<SetPassword />} />
      <Route path="/mnemonics" element={<Mnemonics />} />
      <Route path="/download" element={<Download />} />
      <Route path="/restore" element={<Restore />} />
      <Route path="/success" element={<Success />} />
      <Route path="/confirmation" element={<Confirmation />} />
    </Routes>
  );
}

export default RouterLink;
