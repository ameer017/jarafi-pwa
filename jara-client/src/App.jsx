import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./component/Registration/Register";
import ConfirmEmail from "./component/Registration/Confirm-email";
import CreateWallet from "./component/Registration/SecureWallet/CreateWallet";
import SeedPhrase from "./component/Registration/SecureWallet/SeedPhrase";
import WalletShowcase from "./component/Registration/SecureWallet/WalletShowcase";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/seed-phrase" element={<SeedPhrase />} />
        <Route path="/wallet-showcase" element={<WalletShowcase />} />
      </Routes>
    </>
  );
}

export default App;
