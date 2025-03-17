import { JsonRpcProvider } from "ethers";
import { celo, mainnet } from "viem/chains";

// ================= CHAIN CONFIGURATIONS =================
export const CELO_CHAIN = {
  ...celo,
  rpcUrls: {
    default: { http: ["https://forno.celo.org"] },
    public: { http: ["https://forno.celo.org"] },
  },
};

export const ETHEREUM_CHAIN = {
  ...mainnet,
  rpcUrls: {
    default: { http: ["https://eth.llamarpc.com"] },
    public: { http: ["https://eth.llamarpc.com"] },
  },
};

export const STARKNET_CHAIN = {
  id: 5,
  name: "StarkNet",
  network: "starknet",
  rpcUrls: {
    default: { http: ["https://free-rpc.nethermind.io/mainnet-juno/"] },
    public: { http: ["https://free-rpc.nethermind.io/mainnet-juno/"] },
  },
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
};

// ================= TOKEN CONFIGURATIONS =================
export const cUsd = {
  id: 1,
  name: "cUSD",
  decimals: 18,
  symbol: "cUSD",
  chainId: CELO_CHAIN.id,
  address: "0x765de816845861e75a25fca122bb6898b8b1282a",
  icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/7236.png",
};

export const cEUR = {
  id: 2,
  name: "cEUR",
  decimals: 18,
  symbol: "cEUR",
  chainId: CELO_CHAIN.id,
  address: "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73",
  icon: "https://static.coinpaprika.com/coin/ceur-celo-euro/logo.png",
};

export const celoToken = {
  id: 3,
  name: "CELO",
  decimals: 18,
  symbol: "CELO",
  chainId: CELO_CHAIN.id,
  address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  icon: "https://cryptologos.cc/logos/celo-celo-logo.png?v=040",
};

export const USDC = {
  id: 4,
  name: "USDC",
  decimals: 6,
  symbol: "USDC",
  icon: "https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png",
  networks: {
    [ETHEREUM_CHAIN.id]: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    [CELO_CHAIN.id]: {
      address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    },
    // [STARKNET_CHAIN.id]: {
    //   address:
    //     "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    // },
  },
};

export const ETH = {
  id: 6,
  name: "ETH",
  decimals: 18,
  symbol: "ETH",
  icon: "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
  networks: {
    [ETHEREUM_CHAIN.id]: {
      address: null,
    },
    // [STARKNET_CHAIN.id]: {
    //   address:
    //     "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    // },
  },
};

export const STRK = {
  id: 7,
  name: "Starknet Token",
  decimals: 18,
  symbol: "STRK",
  icon: "https://assets.coingecko.com/coins/images/26433/standard/starknet.png",
  networks: {
    [ETHEREUM_CHAIN.id]: {
      address: "0xca14007eff0db1f8135f4c25b34de49ab0d42766",
    },
    // [STARKNET_CHAIN.id]: {
    //   address:
    //     "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    // },
  },
};

export const USDT = {
  id: 8,
  name: "USDT",
  decimals: 6,
  symbol: "USDT",
  icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
  networks: {
    [ETHEREUM_CHAIN.id]: {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    [CELO_CHAIN.id]: {
      address: "0x617f3112bf5397D0467D315cC709EF968D9ba546",
    },
  },
};

// ================= EXPORT ALL CONFIGS =================
export const TOKENS = [cUsd, cEUR, celoToken, USDC, USDT];

export const RPC_URLS = {
  [CELO_CHAIN.id]: "https://forno.celo.org",
  [ETHEREUM_CHAIN.id]: "https://eth.llamarpc.com",
  [STARKNET_CHAIN.id]: "https://free-rpc.nethermind.io/mainnet-juno/",
};

export const PROVIDERS = {
  [CELO_CHAIN.id]: new JsonRpcProvider("https://forno.celo.org"),
  [ETHEREUM_CHAIN.id]: new JsonRpcProvider("https://eth.llamarpc.com"),
  [STARKNET_CHAIN.id]: new JsonRpcProvider(
    "https://free-rpc.nethermind.io/mainnet-juno/"
  ),
};
