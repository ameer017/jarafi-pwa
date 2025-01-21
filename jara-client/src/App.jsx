import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainScreen from "./pages/onboarding/MainScreen";
import TWE from "./pages/onboarding/TWE";
import SignUpEndpoint from "./pages/onboarding/SignUpEndpoint";
import HomePage from "./component/Homepage/HomePage";
import TokenDetails from "./component/Homepage/TokenDetails";

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
      </Routes>
    </>
  );
}

export default App;
