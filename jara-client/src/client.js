import CapsuleWeb ,{ Environment } from "@usecapsule/react-sdk";

// Retrieve API key from environment variables
const CAPSULE_API_KEY ="2f58cff37e9af36fb3ae09d5424733bd";

// Ensure API key is provided
if (!CAPSULE_API_KEY) {
    throw new Error("Please provide VITE_CAPSULE_API_KEY in the .env file.");
}



// Initialize Capsule client
export const capsuleClient = new CapsuleWeb(Environment.BETA, CAPSULE_API_KEY);