import { WarpFactory } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import fs from 'fs'

//const environment = process.env.WARPENV || 'testnet'
const environment = 'mainnet'
let warp
console.log('PROCESS.ENV: ', environment)

if (environment === 'testnet') {
  warp = WarpFactory.forTestnet().use(new DeployPlugin())
} else if (environment === 'mainnet') {
  warp = WarpFactory.forMainnet().use(new DeployPlugin())
} else {
  throw Error('environment not set properly...')
}

async function configureWallet() {
  try {
    if (environment === 'mainnet') { // changing to mainnet
      try {
        return JSON.parse(fs.readFileSync('../testwallet.json', 'utf-8'))
      } catch (err) {
        const { jwk } = await warp.generateWallet()
        fs.writeFileSync('../testwallet.json', JSON.stringify(jwk))
        return jwk
      }
    } else {
    }
  } catch (err) {
    console.log('Error configuring wallet: ', err)
  }

}

export { configureWallet, warp }
