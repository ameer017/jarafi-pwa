import { Provider, Contract } from "starknet";

import { ETH, S_USDC, S_USDT, STRK } from "../constant/otherChains";
import para from "../constant/paraClient";
import { useAccount } from "wagmi";

export const starknetTokens = [ETH, S_USDC, S_USDT, STRK];
// StarkNet Provider (Infura, Alchemy, etc.)
// const provider = new Provider({
//   rpc: { nodeUrl: "https://starknet-mainnet.infura.io" },
// });

// export async function getTokenBalance(token) {
//   const { address } = useAccount();
//   console.log(address);
//   if (!address) {
//     console.error("User not connected");
//     return 0;
//   }

//   const tokenInfo = starknetTokens[token];
//   const contract = new Contract(
//     ["function balanceOf(address owner) view returns (uint256)"],
//     tokenInfo.address,
//     provider
//   );

//   const balance = await contract.balanceOf(address);
//   return balance.toString() / 10 ** tokenInfo.decimals;
// }
