import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  usdt,
  USDC,
} from "./otherChains";

export const squidConfig = {
  integratorId: import.meta.env.VITE_APP_SQUID_INTEGRATOR_ID,
  apiUrl: "https://apiplus.squidrouter.com",
  themeType: "dark",
  slippage: 1.5,
  defaultTokensPerChain: [
    {
      chainId: 42220,
      tokens: [
        { address: cEUR.address, chainId: 42220 },
        { address: cUsd.address, chainId: 42220 },
        { address: cREAL.address, chainId: 42220 },
        { address: celoToken.address, chainId: 42220 },
        { address: commons.address, chainId: 42220 },
        { address: usdt.address, chainId: 42220 },
        { address: USDC.address, chainId: 42220 },
      ],
    },
  ],
  initialAssets: {
    from: {
      address: cUsd.address,
      chainId: 42220,
    },
    to: {
      address: celoToken.address,
      chainId: 42220,
    },
  },
  availableChains: {
    source: [42220],
    destination: [42220],
  },
  priceImpactWarnings: {
    warning: 3,
    critical: 5,
  },
  theme: {
    baseColor: "#0F0140",
    secondaryColor: "#1E1E1E",
    interactiveColor: "#4F46E5",
    fontFamily: "Inter",
  },
};
