import { http, createConfig } from "wagmi";
import { paraConnector } from "@getpara/wagmi-v2-integration";
import { OAuthMethod } from "@getpara/web-sdk";
import { cEUR, cUsd, cREAL, celoToken, commons, usdt, USDC } from "./otherChains";
import para from "./paraClient";

const connector = paraConnector({
  para: para,
  chains: [celoToken, cUsd, cREAL, cEUR, usdt, USDC],
  appName: "Jarafi PWA",
  options: {},
  nameOverride: "Para",
  idOverride: "para",
  oAuthMethods: Object.values(OAuthMethod),
  disableEmailLogin: false,
  disablePhoneLogin: false,
  onRampTestMode: true,
});

export const config = createConfig({
  chains: [celoToken, cUsd, cREAL, cEUR, commons, usdt, USDC],
  connectors: [connector],
  transports: {
    [celoToken.id]: http(),
    [cUsd.id]: http(),
    [cREAL.id]: http(),
    [cEUR.id]: http(),
    [commons.id]: http(),
    [usdt.id]: http(),
    [USDC.id]: http(),
  },
});
