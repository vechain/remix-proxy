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
    

    const express = require('express');
    const app = express();

    // Respond to POST requests on /api
    app.get('/', (req, res) => {
    // Extract the request parameters
    const { id, method, params } = req.body;

    // Handle the request based on the method name
    switch (method) {
        case 'eth_chainId':
        // Return an array of account addresses
        res.json({ id, result: ['0x1234567890', '0x0987654321'] });
        break;
        case 'eth_blockNumber':
        // Return the current block number
        res.json({ id, result: '0x1234' });
        break;
        // Add more cases here to handle other methods
        default:
        // Return an error for unsupported methods
        res.json({ id, error: 'Unsupported method' });
    }
});

// Start the server on port 3000
app.listen(8545, () => console.log('External provider API listening on port 8545'));

}

    

// hello();
startProxy();




