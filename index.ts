import { Framework } from '@vechain/connex-framework';
import { Driver, SimpleNet, SimpleWallet } from '@vechain/connex-driver';
import { ProviderWeb3 } from '@vechain/web3-providers-connex';
import { HDNode } from 'thor-devkit';
import * as fs from 'fs';
import express from 'express';
import cors from 'cors';
// import jsonRouter = require('express-json-rpc-router');
import { DelegateOpt } from '@vechain/web3-providers-connex/dist/types';

interface Config {
    url: string;
    accounts: {
        mnemonic: string;
        count: number;
    };
    delegate: DelegateOpt;
    port: number;
}

function derivePrivateKeys(mnemonic: string, count: number): Buffer[] {
    const hdNode = HDNode.fromMnemonic(mnemonic.split(' '));
    const hdNodes = [];
    for (let i = 0; i < count; ++i) {
        hdNodes.push(hdNode.derive(i));
    }
    return hdNodes
        .map((node) => node.privateKey)
        .filter((privateKey): privateKey is Buffer => privateKey !== null);
}

async function startProxy(config: Config): Promise<void> {
    console.log('Welcome to Web3 Providers Connex proxy!');

    const net = new SimpleNet(config.url);
    const wallet = new SimpleWallet();

    const keys = derivePrivateKeys(config.accounts.mnemonic, config.accounts.count);
    keys.forEach((buffer) => wallet.import(buffer.toString('hex')));

    const driver = await Driver.connect(net, wallet);
    const connexObj = new Framework(driver);

    const provider = new ProviderWeb3({ connex: connexObj, wallet, net, delegate: config.delegate });

    const app = express();

    app.set('keepAliveTimeout', 60000);
    app.use(cors());
    app.use(express.json());

    app.post('*', async (req: express.Request, res: express.Response) => {
        try {
            res.json({
                jsonrpc: 2.0,
                result: await provider.request(req.body),
                id: req.body.id,
            });
        } catch (e) {
            res.json({
                jsonrpc: 2.0,
                error: e,
                id: req.body.id,
            });
        }
    });

    app.get('*', async (req: express.Request, res: express.Response) => {
        try {
            res.json({
                jsonrpc: 2.0,
                result: await provider.request(req.body),
                id: req.body.id,
            });
        } catch (e) {
            res.json({
                jsonrpc: 2.0,
                error: e,
                id: req.body.id,
            });
        }
    });

    app.listen(config.port, () => console.log('Web3 Providers Connex proxy listening on port ', config.port));
}

function parse_config(): Config {
    const jsonString = fs.readFileSync('config.json', 'utf8');
    const config = JSON.parse(jsonString);
    return config;
}

const config = parse_config();
startProxy(config);