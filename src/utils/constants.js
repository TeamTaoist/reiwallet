
export const SECP256K1_WITNESS_LOCK_SIZE = 65;
export const BTC_JUMP_CONFIRMATION_BLOCKS = 6;
export const RGBPP_TX_WITNESS_MAX_SIZE = 3000;

export const RGBPP_WITNESS_PLACEHOLDER = '0xFF';
export const RGBPP_TX_ID_PLACEHOLDER = '0000000000000000000000000000000000000000000000000000000000000000';

const TestnetInfo = {
  Secp256k1LockDep: {
    outPoint: {
      txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
      index: '0x0',
    },
    depType: 'depGroup',
  },

  RgbppLockScript: {
    codeHash: '0x61ca7a4796a4eb19ca4f0d065cb9b10ddcf002f10f7cbb810c706cb6bb5c3248',
    hashType: 'type',
    args: '',
  },

  RgbppLockDep: {
    outPoint: { txHash: '0xf1de59e973b85791ec32debbba08dff80c63197e895eb95d67fc1e9f6b413e00', index: '0x0' },
    depType: 'code',
  },

  RgbppLockConfigDep: {
    outPoint: { txHash: '0xf1de59e973b85791ec32debbba08dff80c63197e895eb95d67fc1e9f6b413e00', index: '0x1' },
    depType: 'code',
  },

  BtcTimeLockScript: {
    codeHash: '0x00cdf8fab0f8ac638758ebf5ea5e4052b1d71e8a77b9f43139718621f6849326',
    hashType: 'type',
    args: '',
  },

  BtcTimeLockDep: {
    outPoint: { txHash: '0xde0f87878a97500f549418e5d46d2f7704c565a262aa17036c9c1c13ad638529', index: '0x0' },
    depType: 'code',
  },

  BtcTimeLockConfigDep: {
    outPoint: { txHash: '0xde0f87878a97500f549418e5d46d2f7704c565a262aa17036c9c1c13ad638529', index: '0x1' },
    depType: 'code',
  },

  XUDTTypeScript: {
    codeHash: '0x25c29dc317811a6f6f3985a7a9ebc4838bd388d19d0feeecf0bcd60f6c0975bb',
    hashType: 'type',
    args: '',
  },

  XUDTTypeDep: {
    outPoint: {
      txHash: '0xbf6fb538763efec2a70a6a3dcb7242787087e1030c4e7d86585bc63a9d337f5f',
      index: '0x0',
    },
    depType: 'code',
  },

  UniqueTypeScript: {
    codeHash: '0x8e341bcfec6393dcd41e635733ff2dca00a6af546949f70c57a706c0f344df8b',
    hashType: 'type',
    args: '',
  },

  UniqueTypeDep: {
    outPoint: {
      txHash: '0xff91b063c78ed06f10a1ed436122bd7d671f9a72ef5f5fa28d05252c17cf4cef',
      index: '0x0',
    },
    depType: 'code',
  },

  ClusterTypeScript: {
    codeHash: '0x0bbe768b519d8ea7b96d58f1182eb7e6ef96c541fbd9526975077ee09f049058',
    hashType: 'data1',
    args: '',
  },

  ClusterTypeDep: {
    outPoint: {
      txHash: '0xcebb174d6e300e26074aea2f5dbd7f694bb4fe3de52b6dfe205e54f90164510a',
      index: '0x0',
    },
    depType: 'code',
  },

  SporeTypeScript: {
    codeHash: '0x685a60219309029d01310311dba953d67029170ca4848a4ff638e57002130a0d',
    hashType: 'data1',
    args: '',
  },

  SporeTypeDep: {
    outPoint: {
      txHash: '0x5e8d2a517d50fd4bb4d01737a7952a1f1d35c8afc77240695bb569cd7d9d5a1f',
      index: '0x0',
    },
    depType: 'code',
  },
};

const MainnetInfo = {
  Secp256k1LockDep: {
    outPoint: {
      txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
      index: '0x0',
    },
    depType: 'depGroup',
  },

  RgbppLockScript: {
    codeHash: '0xbc6c568a1a0d0a09f6844dc9d74ddb4343c32143ff25f727c59edf4fb72d6936',
    hashType: 'type',
    args: '',
  },

  RgbppLockDep: {
    outPoint: { txHash: '0x04c5c3e69f1aa6ee27fb9de3d15a81704e387ab3b453965adbe0b6ca343c6f41', index: '0x0' },
    depType: 'code',
  },

  RgbppLockConfigDep: {
    outPoint: { txHash: '0x04c5c3e69f1aa6ee27fb9de3d15a81704e387ab3b453965adbe0b6ca343c6f41', index: '0x1' },
    depType: 'code',
  },

  BtcTimeLockScript: {
    codeHash: '0x70d64497a075bd651e98ac030455ea200637ee325a12ad08aff03f1a117e5a62',
    hashType: 'type',
    args: '',
  },

  BtcTimeLockDep: {
    outPoint: { txHash: '0x6257bf4297ee75fcebe2654d8c5f8d93bc9fc1b3dc62b8cef54ffe166162e996', index: '0x0' },
    depType: 'code',
  },

  BtcTimeLockConfigDep: {
    outPoint: { txHash: '0x6257bf4297ee75fcebe2654d8c5f8d93bc9fc1b3dc62b8cef54ffe166162e996', index: '0x1' },
    depType: 'code',
  },

  XUDTTypeScript: {
    codeHash: '0x50bd8d6680b8b9cf98b73f3c08faf8b2a21914311954118ad6609be6e78a1b95',
    hashType: 'data1',
    args: '',
  },

  XUDTTypeDep: {
    outPoint: {
      txHash: '0xc07844ce21b38e4b071dd0e1ee3b0e27afd8d7532491327f39b786343f558ab7',
      index: '0x0',
    },
    depType: 'code',
  },

  UniqueTypeScript: {
    codeHash: '0x2c8c11c985da60b0a330c61a85507416d6382c130ba67f0c47ab071e00aec628',
    hashType: 'data1',
    args: '',
  },

  UniqueTypeDep: {
    outPoint: {
      txHash: '0x67524c01c0cb5492e499c7c7e406f2f9d823e162d6b0cf432eacde0c9808c2ad',
      index: '0x0',
    },
    depType: 'code',
  },

  ClusterTypeScript: {
    codeHash: '0x7366a61534fa7c7e6225ecc0d828ea3b5366adec2b58206f2ee84995fe030075',
    hashType: 'data1',
    args: '',
  },

  ClusterTypeDep: {
    outPoint: {
      txHash: '0xe464b7fb9311c5e2820e61c99afc615d6b98bdefbe318c34868c010cbd0dc938',
      index: '0x0',
    },
    depType: 'code',
  },

  SporeTypeScript: {
    codeHash: '0x4a4dce1df3dffff7f8b2cd7dff7303df3b6150c9788cb75dcf6747247132b9f5',
    hashType: 'data1',
    args: '',
  },

  SporeTypeDep: {
    outPoint: {
      txHash: '0x96b198fb5ddbd1eed57ed667068f1f1e55d07907b4c0dbd38675a69ea1b69824',
      index: '0x0',
    },
    depType: 'code',
  },
};

export const UNLOCKABLE_LOCK_SCRIPT = {
  codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  hashType: 'data',
  args: '0x',
};

export const getSecp256k1CellDep = (isMainnet) =>
  isMainnet ? MainnetInfo.Secp256k1LockDep : TestnetInfo.Secp256k1LockDep;


