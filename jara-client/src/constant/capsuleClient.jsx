import Capsule, { Environment } from "@usecapsule/react-sdk";

const capsuleOpts = {
  supportedWalletTypes: {
    EVM: true,
    COSMOS: true,
    SOLANA: true,
  },
};

const capsuleClient = new Capsule(
  Environment.BETA,
  "2f58cff37e9af36fb3ae09d5424733bd",
  capsuleOpts
);

export default capsuleClient;
