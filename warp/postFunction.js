import { warp, configureWallet } from './configureWarpServer.js'
import { transactionid } from '../transactionid.js'

import Web3 from 'web3'

const web3 = new Web3()

export async function postFunction(raw_func_string) {
  let wallet = await configureWallet()
  const contract = warp.contract(transactionid).connect(wallet)
  await contract.writeInteraction({
    function: 'registerFunction',
    functionString: raw_func_string,
  })
}


