import React from 'react';
import {tryAuthenticate} from 'store/auth/authenticationSlice';
import {Provider} from 'react-redux'
import {SnackbarProvider} from 'notistack';
import {ConfirmProvider} from 'material-ui-confirm';
import L from 'leaflet';
import store from 'utils/store';


export const appInitActions = async (dispatch) => {
  await dispatch(tryAuthenticate()).unwrap();
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

};

export const ProviderWrapper = ({children}) => (
  <Provider store={store()}>
    <ConfirmProvider>
      <SnackbarProvider>
        {children}
      </SnackbarProvider>
    </ConfirmProvider>
  </Provider>
);
