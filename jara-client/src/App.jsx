import React from "react";
import { Route, Routes } from "react-router-dom";
import Buy from "./component/P2P/Buy";
import Sell from "./component/P2P/Sell";
import MainPage from "./component/P2P/MainPage";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/buy" element={<Buy />} /> */}
        <Route path="/p2p" element={<MainPage />} />
        {/* <Route path="/sell" element={<Sell />} /> */}
      </Routes>
    </>
  );
}

export default App;

