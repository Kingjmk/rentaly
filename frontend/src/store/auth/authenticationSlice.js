import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import * as AuthService from 'services/auth';
import {parseErrors} from 'services/api';
import Storage, {StorageKeys} from 'services/storage';


const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
}

export const register = createAsyncThunk(
  'auth/register', async (payload, thunkAPI) => {
    try {
      const res = await AuthService.register(payload);
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(parseErrors(e));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login', async ({email, password}, thunkAPI) => {
    try {
      const res = await AuthService.login({email, password});
      return res.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(parseErrors(e));
    }
  }
);

export const tryAuthenticate = createAsyncThunk(
  'auth/tryAuthenticate', async (payload, thunkAPI) => {
    try {
      const token = Storage.get(StorageKeys.TOKEN);
      const res = await AuthService.checkStatusGivenToken(token);
      return {token, user: res.data};
    } catch (e) {
      console.warn(e);
      return null;
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout', async (payload, thunkAPI) => {
    try {
      return await AuthService.logout();
    } catch (e) {
      return thunkAPI.rejectWithValue(parseErrors(e));
    }
  }
);

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      Storage.set(StorageKeys.TOKEN, state.token);
      return state;
    },
    [tryAuthenticate.fulfilled]: (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        Storage.set(StorageKeys.TOKEN, state.token);
      } else {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        Storage.clear();
      }
      return state;
    },
    [logout.fulfilled]: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      Storage.clear();
      return state;
    },
  },
});

export default authenticationSlice.reducer;
