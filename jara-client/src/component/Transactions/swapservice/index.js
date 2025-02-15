import { createPublicClient, http, parseUnits, formatUnits, encodeFunctionData, numberToHex, concat, size } from "viem";
import { celo } from "viem/chains";
import { createParaAccount, createParaViemClient } from "@getpara/viem-v2-integration";
import { cEUR, cUsd, cREAL, celoToken, commons, cusdt } from "../../../constant/otherChains";
import { PERMIT2_ADDRESS, PERMIT2_ABI, PERMIT2_TYPES } from '../swapservice/abi/permit2Config';

export const useSwapSystem = () => {
  const getQuote = async (fromToken, toToken, amount, walletAddress) => {
    if (!amount || !fromToken || !toToken) return null;

    try {
      const amountIn = parseUnits(amount.toString(), fromToken.decimals);
      
      // Prepare parameters for 0x API
      const params = new URLSearchParams({
        sellToken: fromToken.address,
        buyToken: toToken.address,
        sellAmount: amountIn.toString(),
        takerAddress: walletAddress,
        chainId: celo.id.toString(),
        enablePermit2: "true",
        skipValidation: "true",
        slippagePercentage: "0.01"
      });

      const response = await fetch(
        `https://api.0x.org/swap/v1/quote?${params.toString()}`,
        {
          headers: {
            "0x-api-key": process.env.REACT_APP_0X_API_KEY
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.reason || "Failed to get quote");
      }

      const quote = await response.json();
      
      return {
        ...quote,
        expectedOutput: formatUnits(quote.buyAmount, toToken.decimals),
        estimatedGasInUSD: (Number(quote.estimatedGas) * Number(quote.gasPrice)) / 1e18,
        jarafiFee: Number(formatUnits(quote.sellAmount, fromToken.decimals)) * 0.004,
        formattedPrice: `1 ${fromToken.nativeCurrency.symbol} = ${quote.price} ${toToken.nativeCurrency.symbol}`
      };
    } catch (error) {
      console.error("Failed to get quote:", error);
      throw error;
    }
  };

  const executeSwap = async (fromToken, toToken, amount, paraClient, address) => {
    try {
      const viemParaAccount = await createParaAccount(paraClient);
      const paraViemSigner = createParaViemClient(paraClient, {
        account: viemParaAccount,
        chain: celo,
        transport: http("https://forno.celo.org"),
      });

      // Get quote with permit2
      const quote = await getQuote(fromToken, toToken, amount, address);

      // Handle Permit2 approval if needed
      if (quote.permit2?.approvalRequired) {
        const permit2Contract = {
          address: PERMIT2_ADDRESS,
          abi: PERMIT2_ABI
        };

        const currentAllowance = await paraViemSigner.readContract({
          ...permit2Contract,
          functionName: "allowance",
          args: [address, fromToken.address, quote.allowanceTarget]
        });

        if (currentAllowance[0].lt(quote.sellAmount)) {
          const approveTx = await paraViemSigner.writeContract({
            ...permit2Contract,
            functionName: "approve",
            args: [
              fromToken.address,
              quote.allowanceTarget,
              MaxUint256,
              MaxUint48
            ]
          });
          await paraViemSigner.waitForTransactionReceipt({ hash: approveTx });
        }
      }

      // Handle permit2 signature if needed
      if (quote.permit2?.eip712) {
        const signature = await paraViemSigner.signTypedData({
          ...quote.permit2.eip712,
          types: PERMIT2_TYPES
        });
        
        // Append signature to calldata
        const signatureLengthHex = numberToHex(size(signature), {
          size: 32,
          signed: false,
        });
        
        quote.data = concat([
          quote.data,
          signatureLengthHex,
          signature,
        ]);
      }

      // Execute the swap
      const tx = await paraViemSigner.sendTransaction({
        to: quote.to,
        data: quote.data,
        value: quote.value || "0",
        gasLimit: BigInt(quote.gas || "500000"),
      });

      const receipt = await paraViemSigner.waitForTransactionReceipt({ hash: tx });

      return {
        success: true,
        hash: receipt.transactionHash,
        fromToken: {
          symbol: fromToken.nativeCurrency.symbol,
          amount: amount
        },
        toToken: {
          symbol: toToken.nativeCurrency.symbol,
          amount: quote.expectedOutput
        },
        fees: {
          network: `${quote.estimatedGasInUSD.toFixed(4)} USD`,
          jarafi: `${quote.jarafiFee.toFixed(4)} USD`
        }
      };
    } catch (error) {
      console.error("Swap execution failed:", error);
      throw error;
    }
  };

  // Available tokens for the UI
  const availableTokens = [cUsd, cEUR, cREAL, celoToken, commons, cusdt];

  return {
    getQuote,
    executeSwap,
    availableTokens
  };
};