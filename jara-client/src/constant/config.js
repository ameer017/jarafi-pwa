import { http, createConfig } from "wagmi";
import { capsuleConnector } from "@usecapsule/wagmi-v2-integration";
import { OAuthMethod } from "@usecapsule/web-sdk";
import capsuleClient from "./capsuleClient";
import { cEUR, cUsd, cREAL, Celo } from "./otherChains";

const connector = capsuleConnector({
  capsule: capsuleClient,
  chains: [Celo, cUsd, cREAL, cEUR],
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
  chains: [Celo, cUsd, cREAL, cEUR],
  connectors: [connector],
  transports: {
    [Celo.id]: http(),
    [cUsd.id]: http(),
    [cREAL.id]: http(),
    [cEUR.id]: http(),
  },
});
