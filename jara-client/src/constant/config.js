import { http, createConfig } from "wagmi";
import { capsuleConnector } from "@usecapsule/wagmi-v2-integration";
import { OAuthMethod } from "@usecapsule/web-sdk";
import {
  cEUR,
  cUsd,
  cREAL,
  celoToken,
  commons,
  cusdt,
  USDC,
} from "./otherChains";
import para from "./capsuleClient";

const connector = capsuleConnector({
  capsule: para,
  chains: [celoToken, cUsd, cREAL, cEUR, cusdt, USDC],
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
  chains: [celoToken, cUsd, cREAL, cEUR, commons, cusdt, USDC],
  connectors: [connector],
  transports: {
    [celoToken.id]: http(),
    [cUsd.id]: http(),
    [cREAL.id]: http(),
    [cEUR.id]: http(),
    [commons.id]: http(),
    [cusdt.id]: http(),
    [USDC.id]: http(),
  },
});
