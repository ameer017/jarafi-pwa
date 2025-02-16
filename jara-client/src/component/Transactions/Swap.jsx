import { SquidWidget } from "@0xsquid/widget";
import { squidConfig } from "../../constant/squidClient";
import { http, useAccount, useWalletClient } from "wagmi";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  usdt,
  USDC,
} from "../../constant/otherChains";
import { JsonRpcProvider } from "ethers";
import {
  createParaAccount,
  createParaViemClient,
} from "@getpara/viem-v2-integration";
import para from "../../constant/paraClient";
import axios from "axios";
import { useEffect, useState } from "react";
import { celo } from "viem/chains";

const Swap = () => {
  const { address } = useAccount(); // Get connected wallet address
  const { data: walletClient } = useWalletClient(); // Get the wallet signer

  const tokens = [cEUR, cUsd, cREAL, celoToken, commons, usdt, USDC];
  const provider = new JsonRpcProvider("https://forno.celo.org");

  const [paraSigner, setParaSigner] = useState(null);

  useEffect(() => {
    const initPara = async () => {
      try {
        const viemParaAccount = await createParaAccount(para);
        const paraViemSigner = createParaViemClient(para, {
          account: viemParaAccount,
          chain: celo,
          transport: http("https://forno.celo.org"),
        });
        setParaSigner(paraViemSigner);
      } catch (error) {
        console.error("Error initializing Para signer:", error);
      }
    };

    initPara();
  }, []);

  const getRoute = async (params) => {
    try {
      const result = await axios.post(
        "https://apiplus.squidrouter.com/v2/route",
        params,
        {
          headers: {
            "x-integrator-id": import.meta.env.VITE_APP_SQUID_INTEGRATOR_ID,
            "Content-Type": "application/json",
          },
        }
      );
      return { data: result.data, requestId: result.headers["x-request-id"] };
    } catch (error) {
      console.error("Route error:", error.response?.data || error);
      throw error;
    }
  };

  const handleSwap = async (fromToken, toToken, amount) => {
    if (!address || !walletClient) {
      console.error("Wallet or Para signer not available");
      return;
    }

    try {
      const params = {
        fromAddress: address,
        fromChain: celo,
        fromToken,
        fromAmount: amount,
        toChain: celo,
        toToken,
        toAddress: address,
      };

      console.log("Swap Params:", params);
      const { data: route, requestId } = await getRoute(params);
      const transactionRequest = route.transactionRequest;

      // Approve spending
      await walletClient.sendTransaction({
        to: transactionRequest.target,
        data: transactionRequest.data,
        value: transactionRequest.value,
        gasPrice: await provider.getGasPrice(),
        gasLimit: transactionRequest.gasLimit,
      });

      console.log("Transaction Sent:", transactionRequest);
    } catch (error) {
      console.error("Swap error:", error);
    }
  };

  return (
    <section className="bg-[#0F0140] h-screen w-full flex justify-center items-center">
      <SquidWidget
        config={{
          ...squidConfig,
          wallet: walletClient,
          tokens,
          onSwap: handleSwap,
        }}
      />
    </section>
  );
};

export default Swap;
