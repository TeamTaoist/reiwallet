import React, {useContext, useReducer} from 'react';
import reducer from './reducer';
import INIT_STATE from './initState';

const initState = {...INIT_STATE};

const Web3Context = React.createContext();

const Web3ContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initState);

    return <Web3Context.Provider value={{state,dispatch}}>
        {props.children}
    </Web3Context.Provider>;
};

const useWeb3 = () => ({...useContext(Web3Context)});
export {Web3ContextProvider, useWeb3};
