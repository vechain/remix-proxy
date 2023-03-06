const { Framework }  = require('@vechain/connex-framework');
const { Driver, SimpleNet, SimpleWallet } = require('@vechain/connex-driver');
const { Provider } = require('@vechain/web3-providers-connex');
const { Transaction, secp256k1, mnemonic} = require('thor-devkit');


async function startProxy()
{
    console.log("Welcome to Web3 Providers Connex proxy!");

    // Vechain Provider
    const net = new SimpleNet("http://127.0.0.1:8669")
    const wallet = new SimpleWallet()
    const driver = await Driver.connect(net, wallet)
    const connexObj = new Framework(driver)

    // connexObj is an instance of Connex
    const provider = new Provider({connex: connexObj, net: new SimpleNet("http://127.0.0.1:8669"), delegate: {url: "Hello", signer: "World"}})
    
    // For handling get/post requests from Remix -> Thor
    const express = require('express');
   
    const jsonRouter = require('express-json-rpc-router')
    const app = express()

    const controller = {
        async eth_getBlockByHash(params){
            const block = await provider.request({ 
                method: 'eth_getBlockByHash', 
                params: [params[0]] 
            })
            return block
        },
        async eth_getBlockByNumber({})
        {

        },
        async eth_chainId({})
        {

        },
        async eth_getTransactionByHash({})
        {

        },
        async eth_getBalance({})
        {

        },
        async eth_blockNumber({}) {
            const block_number = await provider.request({ 
                method: 'eth_blockNumber', 
                params: [] 
            })
            return block_number
        },
        async eth_getCode({})
        {

        },
        async eth_syncing({})
        {

        },
        async eth_getTransactionReceipt({})
        {

        },
        async eth_getStorageAt({}){

        },
        async eth_sendTransaction({})
        {

        },
        async eth_call({})
        {

        },
        async eth_estimateGas({})
        {

        },
        async eth_getLogs({})
        {

        },
        async eth_subscribe({})
        {

        },
        async eth_unsubscribe({})
        {

        },
        async eth_accounts({})
        {

        },
        async net_version({})
        {

        },
        // Not sure if we should include these
        async eth_sendRawTransaction({})
        {

        },
        async web3_clientVersion({})
        {

        },
        async eth_gasPrice({})
        {

        },
        async eth_getTransactionCount({})
        {

        }
        
    }

    app.use(express.json())
    app.use(jsonRouter({ methods: controller }))
    app.listen(8545, () => console.log('Example app listening on port 8545'))
}


// hello();
startProxy();




