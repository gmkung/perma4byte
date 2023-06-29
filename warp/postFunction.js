import { warp, configureWallet } from "./configureWarpServer.js";
import { transactionId } from "../transactionid.js";

import Web3 from "web3";

const web3 = new Web3();

export async function postFunction(raw_func_string_arr) {
  let wallet = await configureWallet();
  const contract = warp.contract(transactionId).connect(wallet);
  await contract.writeInteraction({
    function: "registerFunctions",
    functionStrings: raw_func_string_arr,
  });
}
