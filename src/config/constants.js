export const REACT_APP_PASSWORD = "CKB_WALLET_WITH_UTXO";

export const DID_CONTRACT = {
  mainnet: {
    CODE_HASH:
      "0xcfba73b58b6f30e70caed8a999748781b164ef9a1e218424a6fb55ebf641cb33",
    TX_HASH:
      "0x18dda0f02036305b423b85cce276a40417faed044b2ee9220284215f38734daa",
    HASH_TYPE: "type",
    INDEX: "0x0",
    DEP_TYPE: "code",
  },
  testnet: {
    CODE_HASH:
      "0x0b1f412fbae26853ff7d082d422c2bdd9e2ff94ee8aaec11240a5b34cc6e890f",
    TX_HASH:
      "0x1bda44bf86d240b739e035ade4eae2d8a53085210c6dab96b49ffeacb8c1174e",
    HASH_TYPE: "type",
    INDEX: "0x0",
    DEP_TYPE: "code",
  },
};

export const localServer = {
  mainnet: "https://ckb-rpc.caboroca.xyz",
  testnet: "https://ckb-rpc.caboroca.xyz/testnet",
};

export const mainConfig = {
  BTC_ASSETS_API_URL: "https://rgbpp-service-proxy.caboroca.xyz/mainnet",
  BTC_ASSETS_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJIYXN0ZSBQcm8iLCJhdWQiOiJoYXN0ZS5wcm8iLCJqdGkiOiIyYzlkYmM0OS0yMDA1LTQ4YmUtOGI2ZS01YTk0MTBjODY0ZmYiLCJpYXQiOjE3MTQwMzAzMzN9.rHPfzI8Kzns2YgKU6GO7v6dRVuEh9iZkpzvntofcxIE",
  BTC_ASSETS_ORGIN: "haste.pro",
};

export const testConfig = {
  BTC_ASSETS_API_URL: "https://rgbpp-service-proxy.caboroca.xyz/testnet",
  BTC_ASSETS_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyZWl3YWxsZXQiLCJhdWQiOiJyZWl3YWxsZXQub3JpZ2luIiwianRpIjoiNTMxMzJiMWYtYjdkMS00YmMwLWI1MzEtNzJhZjRlOTIyNTZjIiwiaWF0IjoxNzI1NDI3NDYxfQ.eWScwtlXaHqe4z4app-GbWvSE0KOvbzIiknlA1h1S5E",
  BTC_ASSETS_ORGIN: "https://reiwallet.origin",
};
