import { WarpFactory } from "warp-contracts";
import { transactionId } from "./transactionid.js";
import wallet from "./testwallet.json";
import { EthersExtension } from "warp-contracts-plugin-ethers";
/*
 *  environment can be 'local' | 'testnet' | 'mainnet' | 'custom';
 */

//const environment = process.env.NEXT_PUBLIC_WARPENV || "testnet";
const environment = "mainnet";

let warp;
let contract;
console.log("TransactionId", transactionId);
async function getContract() {
  if (environment == "testnet") {
    warp = WarpFactory.forTestnet().use(new EthersExtension());
    contract = warp.contract(transactionId).connect(wallet);
  } else if (environment === "mainnet") {
    warp = WarpFactory.forMainnet().use(new EthersExtension());
    contract = warp.contract(transactionId).connect("use_wallet");
    console.log("Mainnet wallet configured: ", contract);
  } else {
    throw new Error("Environment configured improperly...");
  }
  return contract;
}

export { getContract };
