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
  Swap,
  TokenDetails,
  TWE,
  WalletShowcase,
  Send,
  CardPage,
  Settings,
  FinalFundingExt,
  RequestCard,
  Verify,
  GetVerified,
  SelectResidence,
  SelectId
} from "./index";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  usdt,
  USDC,
} from "./constant/otherChains";
import { AuthRoute, IdleTimeout } from "./component/Registration/AuthRoute";

const tokens = [cEUR, cUsd, cREAL, celoToken, commons, usdt, USDC];

function App() {
  return (
    <>
      <IdleTimeout />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p2p" element={<MainPage />} />
        <Route path="/Cards" element={<MainPage />} />
        <Route path="/main-screen" element={<MainScreen />} />
        <Route path="/trade-with-ease" element={<TWE />} />
        <Route path="/sign-up-endpoint" element={<SignUpEndpoint />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route
          path="/token-details/:id"
          element={<TokenDetails tokens={tokens} />}
        />
        <Route path="/token-details/:id/activities" element={<Activities />} />
        <Route path="/sign-up-user" element={<Register />} />

        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/wallet-showcase" element={<WalletShowcase />} />
        <Route path="/send" element={<AuthRoute element={<Send />} />} />
        <Route
          path="/card-display"
          element={<AuthRoute element={<CardPage />} />}
        />

        <Route path="/final-funding" element={<FinalFundingExt />} />
        <Route path="/congrats" element={<Congratulation />} />

        <Route path="/swap" element={<Swap />} />
        <Route path="/recieve" element={<ReceiveAssets />} />

        <Route path="/swap" element={<AuthRoute element={<Swap />} />} />
        <Route
          path="/recieve"
          element={<AuthRoute element={<ReceiveAssets />} />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/requestCard" element={<RequestCard />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/getVerified" element={<GetVerified />} />
        <Route path="/selectResidence" element={<SelectResidence/>} />
        <Route path="/selectId" element={<SelectId/>} />
      </Routes>
    </>
  );
}

export default App;
