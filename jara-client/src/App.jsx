import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainScreen from "./pages/onboarding/MainScreen";
import TWE from "./pages/onboarding/TWE";
import SignUpEndpoint from "./pages/onboarding/SignUpEndpoint";
import HomePage from "./component/Homepage/HomePage";
import TokenDetails from "./component/Homepage/TokenDetails";
import Register from "./component/Registration/Register";
import ConfirmEmail from "./component/Registration/ConfirmEmail";
import CreateWallet from "./component/Registration/SecureWallet/CreateWallet";
import WalletShowcase from "./component/Registration/SecureWallet/WalletShowcase";
import Congratulation from "./component/Registration/SecureWallet/Congratulation";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main-screen" element={<MainScreen />} />
        <Route path="/trade-with-ease" element={<TWE />} />
        <Route path="/sign-up-endpoint" element={<SignUpEndpoint />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/token-details/:id" element={<TokenDetails />} />
        <Route path="/sign-up-user" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/wallet-showcase" element={<WalletShowcase />} />
        <Route path="/congrats" element={<Congratulation />} />
      </Routes>
    </>
  );
}

export default App;
