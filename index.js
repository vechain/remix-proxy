const { Framework }  = require('@vechain/connex-framework');
const { Driver, SimpleNet, SimpleWallet } = require('@vechain/connex-driver');
const { ProviderWeb3 } = require('@vechain/web3-providers-connex');
const { HDNode, Transaction, secp256k1, mnemonic} = require('thor-devkit');
const fs = require('fs');

BigInt.prototype['toJSON'] = function () {
    return this.toLocaleString().replace(/"(-?\d+)n"/g, (_, a) => a);
};

function derivePrivateKeys(mnemonic, count)  {
    const hdNode = HDNode.fromMnemonic(mnemonic.split(' '));
    let hdNodes = [];
    for (let i = 0; i < count; ++i) {
        hdNodes.push(hdNode.derive(i));
    }
    return hdNodes.map(node => node.privateKey);
}

async function startProxy(config)
{
    console.log("Welcome to Web3 Providers Connex proxy!");
    // console.log("Starting proxy with the following config");
    // console.log(config)

    // Vechain Provider
    const net = new SimpleNet(config.url)
    const wallet = new SimpleWallet()

    // Import keys in wallet
    const keys = derivePrivateKeys(config.accounts.mnemonic, config.accounts.count);
    keys.forEach(buffer => wallet.import(buffer.toString('hex')));

    const driver = await Driver.connect(net, wallet)
    const connexObj = new Framework(driver)

    // connexObj is an instance of Connex
    const provider = new ProviderWeb3({connex: connexObj, wallet: wallet, net: net, delegate: config.delegate})
    
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

    app.listen(config.port, () => console.log('Web3 Providers Connex proxy listening on port ', config.port))
}


function parse_config()
{
    const jsonString = fs.readFileSync('config.json', 'utf8');
    const config = JSON.parse(jsonString);
    return config;
}

config = parse_config();
startProxy(config);




