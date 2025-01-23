import Capsule, { Environment } from "@usecapsule/react-sdk";

const capsuleClient = new Capsule(
  Environment.BETA,
  process.env.VITE_APP_CAPSULE_PROJECT_ID
);

export default capsuleClient;
