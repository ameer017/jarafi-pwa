import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  Activities,
  ConfirmEmail,
  Congratulation,
  CreateWallet,
  Home,
  HomePage,
  Login,
  MainPage,
  MainScreen,
  ReceiveAssets,
  Register,
  SignUpEndpoint,
  TokenDetails,
  TWE,
  WalletShowcase,
} from "./index";

function App() {
  return (
    <>
      <Routes>
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
        <Route path="/recieve" element={<ReceiveAssets />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
