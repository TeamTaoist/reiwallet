const reducer = (state, action) => {
    switch (action.type) {

        case 'SET_PASSWORD':
            return { ...state, password: action.payload};

        case 'SET_MNEMONIC':
            return { ...state, mnemonic: action.payload};

        case 'SET_ACCOUNT':
            return { ...state, account: action.payload};

        case 'SET_REFRESH_NETWORK':
            return { ...state, refresh_network: action.payload};

        case 'SET_CURRENT_ACCOUNT':
            return { ...state, refresh_current: action.payload};


        // case 'SET_ERROR':
        //     return { ...state, errorTips: action.payload };


        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
};
export default reducer
