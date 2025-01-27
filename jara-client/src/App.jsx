import React from "react";
import { Route, Routes } from "react-router-dom";
import Buy from "./component/P2P/Buy";
import Sell from "./component/P2P/Sell";
import MainPage from "./component/P2P/MainPage";
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
import Home from "./pages/Home";
import Activities from "./component/Homepage/Activities";
import Send from "./component/Transactions/Send";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/buy" element={<Buy />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/p2p" element={<MainPage />} />
        <Route path="/main-screen" element={<MainScreen />} />
        <Route path="/trade-with-ease" element={<TWE />} />
        <Route path="/sign-up-endpoint" element={<SignUpEndpoint />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/token-details/:id" element={<TokenDetails />} />
        <Route path="/token-details/:id/activities" element={<Activities />} />
        <Route path="/sign-up-user" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/wallet-showcase" element={<WalletShowcase />} />
        <Route path="/send" element={<Send />} />
        <Route path="/congrats" element={<Congratulation />} />
        {/* <Route path="/sell" element={<Sell />} /> */}
      </Routes>
    </>
  );
}

export default App;

