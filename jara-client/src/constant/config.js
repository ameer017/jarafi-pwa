import { http, createConfig } from "wagmi";
import { capsuleConnector } from "@usecapsule/wagmi-v2-integration";
import { OAuthMethod } from "@usecapsule/web-sdk";
import capsuleClient from "./capsuleClient";
import { cEUR, cUsd, cREAL, celoToken, commons } from "./otherChains";

const connector = capsuleConnector({
  capsule: capsuleClient,
  chains: [celoToken, cUsd, cREAL, cEUR, ],
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
  chains: [celoToken, cUsd, cREAL, cEUR, commons],
  connectors: [connector],
  transports: {
    [celoToken.id]: http(),
    [cUsd.id]: http(),
    [cREAL.id]: http(),
    [cEUR.id]: http(),
    [commons.id]: http(),
  },
});
