import { configureWallet } from './configureWarpServer.js'
import { EthersExtension } from 'warp-contracts-plugin-ethers'
import { WarpFactory } from 'warp-contracts'

import { transactionid } from '../transactionid.js'

const warp = WarpFactory.forMainnet().use(new EthersExtension())

async function read(hex_signature) {
  let wallet = await configureWallet()
  const contract = warp.contract(transactionid).connect(wallet)
  console.log(contract._contractTxId)
  const { cachedValue } = await contract.readState()
  //console.log('Contract state: ', JSON.stringify(cachedValue))
}

read('0x6a761202')
