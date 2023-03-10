# Remix-proxy
Proxy Thor's RESTful API to Eth JSON-RPC, to support Remix IDE.

# Running in solo mode

## Fetch dependencies
```bash
npm install
```

## Start Thor
You need to have Thor running locally in solo mode for this example to work. Find out more about Thors different options and how to build it [here](https://github.com/vechain/thor).

## Setup config
The following config will setup the proxy to work out of the box with Thor in solo mode running locally on the same machine.

```
{
    "url": "http://127.0.0.1:8669",
    "port": 8545,
    "accounts": {
      "mnemonic": "denial kitchen pet squirrel other broom bar gas better priority spoil cross",
      "count": 10
    }
  }
```

## Run proxy
```bash
node index.js
```

## Connect with Remix

1. Go to DEPLOY & RUN TRANSACTIONS section
2. Choose Custom - External HTTP provider
3. Choose the default options (`http://127.0.0.1:8545`) and click Ok
4. Compile and deploy contracts
