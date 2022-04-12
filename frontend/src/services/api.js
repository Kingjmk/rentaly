import axios from 'axios';
import constants from 'utils/constants';
import Storage, {StorageKeys} from 'services/storage';

const api = axios.create();

api.defaults.baseURL = constants.HOST_URL;

api.defaults.headers = constants.API_HEADERS;

// To share cookies to cross site domain, change to true.
api.defaults.withCredentials = false;

export const getToken = () => Storage.get(StorageKeys.TOKEN) || null;

api.interceptors.request.use((config) => {
  const token = getToken();
  if (!token) return config;
  config.headers.Authorization = `Token ${token}`;
  return config;
});

export const parseErrors = (error) => {
  let errors = {};

  if (error.response) {
    let res = error.response;
    if (res.status === 400) {
      errors = res.data;
    } else {
      errors.non_field_errors = ['Internal Server error'];
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    errors.non_field_errors = ['Network error'];
  } else {
    // Something happened in setting up the request that triggered an Error
    throw error;
  }

  return {
    apiErrors: errors,
  };
}


export default api;
