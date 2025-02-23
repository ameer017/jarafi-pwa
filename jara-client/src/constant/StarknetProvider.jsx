import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import para from "./paraClient";
import { useAccount } from "wagmi";

export function StarknetProvider({ children }) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });
  const { address } = useAccount();

  // Get user's StarkNet address from Para Wallet
  const starknetAddress = para.getStarknetAddress ? address : null;

  console.log(starknetAddress);
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
