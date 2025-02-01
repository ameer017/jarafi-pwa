import { Contract, ethers } from "ethers";

import { FeeAmount } from "@uniswap/v3-sdk";

const UBESWAP_FACTORY_ADDRESS = "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc";

const UBESWAP_FACTORY_ABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee) view returns (address)",
];

export const getPoolAddress = async (tokenA, tokenB, provider) => {
  const factoryContract = new Contract(
    UBESWAP_FACTORY_ADDRESS,
    UBESWAP_FACTORY_ABI,
    provider
  );

  const feeTier = FeeAmount.MEDIUM;

  try {
    const poolAddress = await factoryContract.getPool(
      tokenA.address,
      tokenB.address,
      feeTier
    );

    return poolAddress;
  } catch (error) {
    console.error("Error fetching pool address:", error);
    return null;
  }
};

const MIN_TICK = -887272;
const MAX_TICK = 887272;

function validateTick(tick) {
  if (typeof tick !== "number" || !Number.isInteger(tick)) {
    throw new Error("Tick must be an integer");
  }
  if (tick < MIN_TICK || tick > MAX_TICK) {
    throw new Error(`Tick must be between ${MIN_TICK} and ${MAX_TICK}`);
  }
  return tick;
}

function validateSqrtPriceX96(sqrtPriceX96) {
    if (typeof sqrtPriceX96 !== "string") {
      throw new Error("sqrtPriceX96 must be a string");
    }
    if (!/^\d+$/.test(sqrtPriceX96)) {
      throw new Error("sqrtPriceX96 must be a valid positive integer string");
    }
    if (BigInt(sqrtPriceX96) > BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")) {
      throw new Error("sqrtPriceX96 must be a valid uint160 value");
    }
    return sqrtPriceX96;
  }

export const getPoolState = async (tokenA, tokenB, provider) => {
  const POOL_ABI = [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function fee() view returns (uint24)",
    "function liquidity() view returns (uint128)",
    "function slot0() view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)",
  ];
  const poolAddress = await getPoolAddress(tokenA, tokenB, provider);

  if (!poolAddress) {
    throw new Error("Pool address not found");
  }

  const poolContract = new Contract(poolAddress, POOL_ABI, provider);

  console.log(poolContract);
  console.log("Pool Address:", poolAddress);
  try {
    const [token0, token1, fee, liquidity, slot0] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    const feeNumber = Number(fee);

    const validFees = [FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];
    const isValidFee = validFees.includes(fee);

    console.log(fee);

    const tick = parseInt(slot0[1]);

    console.log("Tick:", tick, "Type:", typeof tick);

    try {
      validateTick(tick);
    } catch (error) {
      console.error("Invalid tick value:", error);
      throw error;
    }

    const sqrtPriceX96 = slot0[0].toString(); // Convert to string to avoid BigInt conversion issues
    try {
        validateSqrtPriceX96(sqrtPriceX96);
      } catch (error) {
        console.error("Invalid sqrtPriceX96 value:", error);
        throw error;
      }

    return {
      token0,
      token1,
      fee: isValidFee ? feeNumber : FeeAmount.MEDIUM,
      liquidity,
      sqrtPriceX96,
      tick,
    };
  } catch (error) {
    console.error("Error fetching pool state:", error);
    return null;
  }
};
// console.log(FeeAmount)
