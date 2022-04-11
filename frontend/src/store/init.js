import {tryAuthenticate} from 'store/auth/authenticationSlice';


export const appInitActions = async (dispatch) => {
  await dispatch(tryAuthenticate()).unwrap();
};
