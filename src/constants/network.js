export const  networkList = [
    {
        name:"Mainnet",
        value:"mainnet",
        nativeCurrency: {
            symbol: 'CKB',
            decimals: 8
        },
        rpcUrl:{
            node:"https://mainnet.ckb.dev/rpc",
            indexer:"https://mainnet.ckb.dev/indexer"
        },
        blockExplorerUrls:"https://explorer.nervos.org/"
    },
    {
        name:"Testnet",
        value:"testnet",
        nativeCurrency: {
            symbol: 'tCKB',
            decimals: 8
        },
        rpcUrl:{
            node:"https://testnet.ckb.dev/rpc",
            indexer:"https://testnet.ckb.dev/indexer"
        },
        blockExplorerUrls:"https://pudge.explorer.nervos.org/"
    },
]
