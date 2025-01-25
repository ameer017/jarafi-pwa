import { chainConfig } from "viem/celo";

import { defineChain } from "viem";
import { celo } from "viem/chains";

export const cUsd = defineChain({
  ...chainConfig,
  id: celo.id,
  name: "cUSD",
  network: celo,
  icon:"https://s2.coinmarketcap.com/static/img/coins/200x200/7236.png",
  rpcUrls: {
    default: { http: ["https://forno.celo.org"] },
    public: { http: ["https://forno.celo.org"] },
  },
  blockExplorers: {
    default: { name: "Celo Explorer", url: "https://explorer.celo.org" },
  },
  nativeCurrency: {
    name: "Celo Dollar",
    symbol: "cUSD",
    decimals: 18,
  },
});

export const USDC = defineChain({
  ...chainConfig,
  id: celo.id,
  name: "USDC",
  network: celo,
  icon:"https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040",
  rpcUrls: {
    default: { http: ["https://forno.celo.org"] },
    public: { http: ["https://forno.celo.org"] },
  },
  blockExplorers: {
    default: { name: "Celo Explorer", url: "https://explorer.celo.org" },
  },
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
});

export const USDT = defineChain({
  ...chainConfig,
  id: celo.id,
  name: "USDT",
  network: celo,
  icon:"https://w7.pngwing.com/pngs/840/253/png-transparent-usdt-cryptocurrencies-icon.png",
  rpcUrls: {
    default: { http: ["https://forno.celo.org"] },
    public: { http: ["https://forno.celo.org"] },
  },
  blockExplorers: {
    default: { name: "Celo Explorer", url: "https://explorer.celo.org" },
  },
  nativeCurrency: {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
  },
});

export const CEUR = defineChain({
  ...chainConfig,
  id: celo.id,
  name: "CEUR",
  network: celo,
  icon:"https://cryptologos.cc/logos/celo-celo-logo.png?v=040",
  rpcUrls: {
    default: { http: ["https://forno.celo.org"] },
    public: { http: ["https://forno.celo.org"] },
  },
  blockExplorers: {
    default: { name: "Celo Explorer", url: "https://explorer.celo.org" },
  },
  nativeCurrency: {
    name: "Celo Euro",
    symbol: "CEUR",
    decimals: 18,
  },
});
