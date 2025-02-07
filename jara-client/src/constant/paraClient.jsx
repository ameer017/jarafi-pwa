import Para, { Environment } from "@getpara/react-sdk";

const para = new Para(
  Environment.BETA,
  import.meta.env.VITE_APP_PARA_PROJECT_ID
);

export default para;
