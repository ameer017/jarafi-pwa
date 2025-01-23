import { http, createConfig } from "wagmi";
import { celo } from "wagmi/chains";
import { capsuleConnector } from "@usecapsule/wagmi-v2-integration";
import { OAuthMethod } from "@usecapsule/web-sdk";
import capsuleClient from "./capsuleClient";
import { CEUR, cUsd, USDC, USDT } from "./otherChains";

const connector = capsuleConnector({
  capsule: capsuleClient,
  chains: [celo, cUsd, USDC, USDT, CEUR],
  appName: "Jarafi PWA",
  options: {},
  nameOverride: "Capsule",
  idOverride: "capsule",
  oAuthMethods: Object.values(OAuthMethod),
  disableEmailLogin: false,
  disablePhoneLogin: false,
  onRampTestMode: true,
});

export const config = createConfig({
  chains: [celo],
  connectors: [connector],
  transports: {
    [celo.id]: http(),
    [cUsd.id]: http(),
    [USDC.id]: http(),
    [USDT.id]: http(),
    [CEUR.id]: http(),
  },
});
