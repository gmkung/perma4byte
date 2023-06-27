import { warp, configureWallet } from './configureWarpServer.js'
import { transactionid } from '../transactionid.js'
import { v4 as uuid } from 'uuid'
import Web3 from 'web3'

const web3 = new Web3()

function normalizeFunctionString(fn) {
  // Remove whitespace and semicolons
  fn = fn.replace(/\s+/g, '').replace(/;/g, '')

  // Extract the function name and parameters
  const functionName = fn.substring(0, fn.indexOf('('))
  const parameters = fn.substring(fn.indexOf('(') + 1, fn.indexOf(')'))

  // Normalize the parameters by dropping names and extraneous whitespace
  const normalizedParameters = parameters
    .split(',')
    .map((param) => param.trim().split(' ')[0])
    .join(',')

  // Construct the normalized function string
  return `${functionName}(${normalizedParameters})`
}

function calculateFourByteSignature(functionSignature) {
  //const hash = web3.utils.keccak256(functionSignature)
  //return hash.slice(0, 10)
  return web3.eth.abi.encodeFunctionSignature(functionSignature)
}

async function createPost(raw_func_string) {
  const text_signature = normalizeFunctionString(raw_func_string)
  const hex_signature = calculateFourByteSignature(text_signature)

  let wallet = await configureWallet()
  const contract = warp.contract(transactionid).connect(wallet)
  await contract.writeInteraction({
    function: 'createPost',
    post: {
      text_signature: "ASD",
      hex_signature: hex_signature,
      id: uuid(),
    },
  })
}

createPost('requestStatusChange (address) ')
