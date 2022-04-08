import {tryAuthenticate} from 'store/auth/authenticationSlice';


export const appInitActions = [
    tryAuthenticate(),
];
