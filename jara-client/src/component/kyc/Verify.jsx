import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Dojah from "react-dojah";

const Verify = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  // Dojah credentials from environment variables
  const dojahCredentials = {
    appID: import.meta.env.VITE_APP_DOJAH_APP_ID,
    publicKey: import.meta.env.VITE_APP_DOJAH_PUBLIC_KEY,
    widget_id: import.meta.env.VITE_APP_DOJAH_WIDGET_ID,
    reference_id: address ? address.toString() : null,
  };

  const { appID, publicKey, widget_id, reference_id } = dojahCredentials;

 
  if (!appID || !publicKey || !widget_id || !reference_id) {
    console.error("Missing Dojah credentials:", dojahCredentials);
    return (
      <section className="bg-[#D0D6FF80] min-h-screen flex flex-col justify-center items-center">
        <header className="bg-[#0F0140] w-full p-4 flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold">My Card</h2>
        </header>
        <main className="flex flex-col items-center flex-grow w-auto md:w-[400px]">
          <p className="text-center text-red-500 mt-12">Invalid Dojah configuration</p>
        </main>
      </section>
    );
  }

  // Handle Dojah response
  const handleResponse = async (responseType, data) => {
    console.log(`Dojah response: ${responseType}`, data);

    if (responseType === "success") {
      // Update KYC status to pending
      try {
        const payload = { referenceId: reference_id, status: "pending" };
        console.log("Sending PUT request with payload:", payload);
        const response = await axios.put(`http://localhost:3500/pwauser/update_status`, payload);
        if (response.status !== 200) {
          throw new Error("Failed updating status");
        }
        console.log("KYC status updated to pending");
        navigate("/card-display"); // Navigate on success
      } catch (error) {
        console.error(`Error updating status: ${error}`);
        setScriptError("Failed to update verification status. Please try again.");
        navigate("/request-card"); // Redirect to retry
      }
      setLoading(false);
    } else if (responseType === "error") {
      console.error("Dojah error:", data);
      setScriptError("Verification failed. Please try again.");
      navigate("/request-card"); // Redirect to retry
      setLoading(false);
    } else if (responseType === "close") {
      console.log("Widget closed");
      // Check status before navigating
      try {
        const response = await axios.get(`http://localhost:3500/pwauser/${reference_id}`);
        if (response.data.kycStatus === "pending" || response.data.kycStatus === "verified") {
          navigate("/card-display");
        } else {
          navigate("/request-card"); // Retry if no valid status
        }
      } catch (error) {
        console.error("Error checking status on close:", error);
        navigate("/request-card"); 
      }
      setLoading(false);
    } else if (responseType === "begin") {
      console.log("Verification process started");
      setLoading(true);
    } else if (responseType === "loading") {
      console.log("Widget loading");
      setLoading(true);
    }
  };

  // Dojah configuration
  const config = {
    widget_id,
    reference_id
  };

  const metadata = {
    user_id: address,
  };



  return (
    <section className="bg-[#D0D6FF80] min-h-screen flex flex-col justify-center items-center">
      <header className="bg-[#0F0140] w-full p-4 flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold">My Card</h2>
      </header>

      <main className="flex flex-col items-center flex-grow w-auto md:w-[400px]">
        {scriptError && (
          <p className="text-center text-red-500 mt-12">{scriptError}</p>
        )}
        <div className="flex flex-col items-center justify-center mt-[120px] gap-10">
          <img
            src="/verify.png"
            alt="Verification Icon"
            className="h-[122px] w-[122px]"
          />
          <h4 className="font-['Merriweather Sans'] font-bold text-[24px] text-center text-[#262526]">
            Now, let's verify your photo ID
          </h4>
        </div>

        <p className="w-[228px] sm:w-[300px] mt-12 text-center text-[17px] text-[#6F6B6F] font-normal font-['Montserrat']">
          This will establish your identity, and prevent someone else from
          claiming your account.
        </p>

        <button
          onClick={() => document.getElementById("dojah-widget").click()}
          className="w-full md:w-[350px] flex justify-center items-center px-4 py-3 bg-[#F2E205] rounded-lg font-['Montserrat'] font-semibold text-base text-[#4F4E50] mt-6 hover:bg-[#E0D204] transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Loading... Please wait!" : "Continue"}
        </button>

        {/* Hidden Dojah widget, triggered by button */}
        <div style={{ display: "none" }}>
          <Dojah
            response={handleResponse}
            appID={appID}
            publicKey={publicKey}
            type="custom"
            config={config}
            metadata={metadata}
            id="dojah-widget"
          />
        </div>
      </main>
    </section>
  );
};

export default Verify;