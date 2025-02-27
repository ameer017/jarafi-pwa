import React from "react";
import { Route, Routes } from "react-router-dom";
import {
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
  SelectId,
  PinSetup,
} from "./index";

import { AuthRoute, IdleTimeout } from "./component/Registration/AuthRoute";
import { TOKENS } from "./constant/otherChains";

const tokens = TOKENS;

function App() {
  return (
    <>
      <IdleTimeout />

      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route
          path="/token-details/:id"
          element={<TokenDetails tokens={tokens} />}
        />

        {/* Peer - to - Peer space */}
        <Route path="/p2p" element={<MainPage />} />

        {/* Cards management */}
        <Route
          path="/card-display"
          element={<AuthRoute element={<CardPage />} />}
        />
        <Route path="/final-funding" element={<FinalFundingExt />} />
        <Route
          path="/request-card"
          element={<AuthRoute element={<RequestCard />} />}
        />
        <Route path="/verify" element={<Verify />} />
        <Route path="/get-verified" element={<GetVerified />} />
        <Route path="/select-residence" element={<SelectResidence />} />
        <Route path="/select-id" element={<SelectId />} />

        {/* Onboarding */}
        <Route path="/main-screen" element={<MainScreen />} />
        <Route path="/trade-with-ease" element={<TWE />} />
        <Route path="/sign-up-endpoint" element={<SignUpEndpoint />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/wallet-showcase" element={<WalletShowcase />} />
        <Route path="/congrats" element={<Congratulation />} />

        {/* Transaction management */}
        <Route path="/send" element={<AuthRoute element={<Send />} />} />
        <Route path="/swap" element={<AuthRoute element={<Swap />} />} />
        <Route
          path="/recieve"
          element={<AuthRoute element={<ReceiveAssets />} />}
        />

        {/* Authentication */}
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up-user" element={<Register />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/create-pin" element={<PinSetup />} />
      </Routes>
    </>
  );
}

export default App;
