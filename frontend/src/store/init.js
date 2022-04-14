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
    iconRetinaUrl: require('assets/leaflet/marker-icon.png'),
    iconUrl: require('assets/leaflet/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
};

export const ProviderWrapper = ({children}) => (
  <Provider store={store()}>
    <ConfirmProvider>
      <SnackbarProvider domRoot={document.getElementById('react-notification')}>
        {children}
      </SnackbarProvider>
    </ConfirmProvider>
  </Provider>
);
