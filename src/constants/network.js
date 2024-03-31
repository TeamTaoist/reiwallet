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

export const clusterScript = {
    testnet:{
        script:{
            codeHash: "0x7366a61534fa7c7e6225ecc0d828ea3b5366adec2b58206f2ee84995fe030075",
            hashType: 'data1',
            args: '',
        }
    },
    mainnet:{
        script:{
            codeHash: "0x7366a61534fa7c7e6225ecc0d828ea3b5366adec2b58206f2ee84995fe030075",
            hashType: 'data1',
            args: '',
        }
    }
}
