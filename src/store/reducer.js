const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PASSWORD":
      return { ...state, password: action.payload };

    case "SET_MNEMONIC":
      return { ...state, mnemonic: action.payload };

    case "SET_ACCOUNT":
      return { ...state, account: action.payload };

    case "SET_REFRESH_NETWORK":
      return { ...state, refresh_network: action.payload };

    case "SET_CURRENT_ACCOUNT":
      return { ...state, refresh_current: action.payload };

    case "SET_WALLET_LIST":
      return { ...state, refresh_wallet_list: action.payload };

    case "SET_IMPORT_MNEMONIC":
      return { ...state, importMnemonic: action.payload };

    case "SET_DOB_DETAIL":
      return { ...state, dob: action.payload };

    case "SET_SUDT_DETAIL":
      return { ...state, sudt: action.payload };

    case "SET_XUDT_DETAIL":
      return { ...state, xudt: action.payload };

    case "SET_CLUSTER_DETAIL":
      return { ...state, cluster: action.payload };

    case "SET_STEALTHEX_TOKEN":
      return { ...state, stealthex_token: action.payload };

    // case 'SET_ERROR':
    //     return { ...state, errorTips: action.payload };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};
export default reducer;
