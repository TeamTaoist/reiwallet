const reducer = (state, action) => {
    switch (action.type) {

        case 'SET_PASSWORD':
            return { ...state, password: action.payload};


        // case 'SET_ERROR':
        //     return { ...state, errorTips: action.payload };


        default:
            throw new Error(`Unknown type: ${action.type}`);
    }
};
export default reducer
