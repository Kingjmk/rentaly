import {tryAuthenticate} from 'store/auth/authenticationSlice';
import L from 'leaflet';


export const appInitActions = async (dispatch) => {
  await dispatch(tryAuthenticate()).unwrap();
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

};
