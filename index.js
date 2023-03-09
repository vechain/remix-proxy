const { Framework }  = require('@vechain/connex-framework');
const { Driver, SimpleNet, SimpleWallet } = require('@vechain/connex-driver');
const { ProviderWeb3 } = require('@vechain/web3-providers-connex');
const { HDNode, Transaction, secp256k1, mnemonic} = require('thor-devkit');


function derivePrivateKeys(mnemonic, count)  {
    const hdNode = HDNode.fromMnemonic(mnemonic.split(' '));
    let hdNodes = [];
    for (let i = 0; i < count; ++i) {
        hdNodes.push(hdNode.derive(i));
    }
    return hdNodes.map(node => node.privateKey);
}

async function startProxy()
{
    console.log("Welcome to Web3 Providers Connex proxy!");

    // Vechain Provider
    const net = new SimpleNet("http://127.0.0.1:8669")
    const wallet = new SimpleWallet()

    // Import keys in wallet
    const keys = derivePrivateKeys("denial kitchen pet squirrel other broom bar gas better priority spoil cross", 10);
    keys.forEach(buffer => wallet.import(buffer.toString('hex')));

    const driver = await Driver.connect(net, wallet)
    const connexObj = new Framework(driver)

    // connexObj is an instance of Connex
    const provider = new ProviderWeb3({connex: connexObj, wallet: wallet, net: net})
    
    // For handling get/post requests from Remix -> Thor
    const express = require('express');
   
    const jsonRouter = require('express-json-rpc-router')
    const app = express()
    var cors = require('cors')

    // Set the Keep-Alive timeout to 60 seconds
    app.set('keepAliveTimeout', 60000);
    app.use(cors())
    app.use(express.json())


    app.post('*', async (req, res) => {
        try {
            res.json({
               jsonrpc: 2.0,
               result: await provider.request(req.body),
               id: req.body.id
            })
        }
        catch (e) {
            res.json({
               jsonrpc: 2.0,
               error: e,
               id: req.body.id
            })
          }
      });

    app.get('*', async (req, res) => {
        try {
            res.json({
               jsonrpc: 2.0,
               result: await provider.request(req.body),
               id: req.body.id
            })
        }
        catch (e) {
            res.json({
               jsonrpc: 2.0,
               error: e,
               id: req.body.id
            })
          }
      });

    app.listen(8545, () => console.log('Example app listening on port 8545'))
}

startProxy();




