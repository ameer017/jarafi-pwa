import { CapsuleModal } from "@usecapsule/react-sdk";
import React, { useState } from "react";
import capsuleClient from "../../constant/capsuleClient";
import { useNavigate } from "react-router-dom";

const SeedPhrase = () => {
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));

  const handleInputChange = (index, value) => {
    const updatedSeedPhrase = [...seedPhrase];
    updatedSeedPhrase[index] = value;
    setSeedPhrase(updatedSeedPhrase);
  };

  return (
    <form className="w-full">
      <p className="text-[16px] text-[#0F0140] ">
        Kindly enter your seed phrase below
      </p>

      <div className="grid grid-cols-3 gap-4 w-full my-4">
        {seedPhrase.map((word, index) => (
          <input
            key={index}
            type="text"
            value={word}
            maxLength={15}
            placeholder={` ${index + 1}`}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="border-[1px] border-[#262526BF] rounded-md px-3 py-2 focus:outline-none focus:border-[#262526BF] text-center"
          />
        ))}
      </div>

      <button className="bg-[#F2E205] rounded-lg p-[10px] text-[16px] font-[Montserrat] font-[600] text-[#4F4E50] w-full ">
        Login
      </button>
    </form>
  );
};

const Login = () => {
  const [loginType, setLoginType] = useState("email");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsModalOpen(true);

    const loggedIn = await capsuleClient.isFullyLoggedIn();

    if (loggedIn) {
      navigate("/dashboard");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email address.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const isExistingUser = await capsuleClient.checkIfUserExists(email);

    if (isExistingUser) {
      const webAuthUrlForLogin = await capsuleClient.initiateUserLogin(
        email,
        false,
        "email"
      );

      const popupWindow = window.open(
        webAuthUrlForLogin,
        "loginPopup",
        "popup=true"
      );

      const { needsWallet } = await capsuleClient.waitForLoginAndSetup(
        popupWindow
      );

      if (needsWallet) {
        const [wallet, recoverySecret] = await capsuleClient.createWallet();
        setIsLoading(false);
        navigate("/dashboard", { state: { email, wallet, recoverySecret } });
      } else {
        setIsLoggedIn(true);
        setIsLoading(false);
        const loggedIn = await capsuleClient.isFullyLoggedIn();

        if (loggedIn) {
          navigate("/dashboard", { state: { email } });
        }
      }
    } else {
      await capsuleClient.createUser(email);
      setIsLoading(false);
      navigate("/confirm-email", { state: { email } });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4">
      <form className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6 flex flex-col items-center justify-center">
        <div>
          <img src="/JaraFiLogin.png" alt="Login" />
        </div>

        <div className="w-full flex flex-col items-start gap-4">
          <h1 className="text-[24px] font-[700] text-[#0F0140]">Login</h1>

          <div className="border-[1px] border-[#0F0140] p-[5px] rounded-lg flex">
            <button
              type="button"
              onClick={() => setLoginType("email")}
              className={`p-[7px] px-[10px] rounded-lg text-[12px] ${
                loginType === "email"
                  ? "bg-[#0F0140] text-white"
                  : "text-[#0F0140]"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginType("seedPhrase")}
              className={`p-[7px] rounded-lg text-[12px] ${
                loginType === "seedPhrase"
                  ? "bg-[#0F0140] text-white"
                  : "text-[#0F0140]"
              }`}
            >
              Seed Phrase
            </button>
          </div>

          {loginType === "email" ? (
            <div className="w-full flex flex-col">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-[1px] border-[#262526BF] rounded-md px-3 py-2 focus:outline-none focus:border-[#262526BF] outline-none"
              />

              <div className="flex flex-col gap-4 w-full my-6">
                <button
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-[#4F4E50] bg-[#F2E205] hover:bg-[#F7E353] focus:outline-none ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleEmailLogin}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>

                <button
                  type="button"
                  className="bg-[#FCFEE8] border-[1px] border-[#F2E205] rounded-lg p-[10px] text-[16px] font-[Montserrat] font-[600] text-[#4F4E50] "
                  onClick={handleGoogleLogin}
                >
                  <div className="flex items-center justify-center gap-2">
                    Continue with Google
                    <img
                      src="https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-google-icon-PNG.png"
                      className="w-[24px] h-[24px] border-2 border-white border-t-transparent rounded-full "
                    />
                  </div>
                </button>

                <CapsuleModal
                  capsule={capsuleClient}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  logo={
                    "https://www.jarafi.xyz/assets/full-logo-blue-b7QovqMI.svg"
                  }
                  theme={{
                    foregroundColor: "#ffffff",
                    backgroundColor: "#ffffff",
                    font: "Merriweather",
                    borderRadius: "md",
                    mode: "light",
                  }}
                  oAuthMethods={["GOOGLE"]}
                  disableEmailLogin
                  disablePhoneLogin
                  authLayout={["AUTH:FULL"]}
                  externalWallets={[]}
                  recoverySecretStepEnabled
                  onRampTestMode={true}
                />
              </div>
            </div>
          ) : (
            <SeedPhrase />
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
