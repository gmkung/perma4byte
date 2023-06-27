import { warp, configureWallet } from './configureWarpServer.js'
import { transactionid } from '../transactionid.js'
import { v4 as uuid } from 'uuid'

async function createPost() {
  
  let wallet = await configureWallet()
  const contract = warp.contract(transactionid).connect(wallet)
  await contract.writeInteraction({
    function: "createPost",
    post: {
      title: "Hi from 2nd post!",
      content: "This is my 2nd post!",
      id: uuid()
    }
  })
  return ('Yaassss')
}

createPost()