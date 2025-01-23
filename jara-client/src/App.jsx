import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Recieve from './component/Transactions/Receive'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recieve" element={<Recieve/>} />

      </Routes>
    </>
  );
}

export default App;
