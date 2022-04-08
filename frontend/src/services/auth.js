import api from 'services/api'

export const login = async ({email, password}) => {
  const url = '/auth/login';

  return await api.post(url, {
    email, password,
  }, {
    headers: {},
  });
}

export const logout = async () => {
  const url = '/auth/logout';
  return await api.post(url);
}

export const checkStatusGivenToken = async (token) => {
  const url = '/auth/status';

  if (!token) throw Error('Token invalid');

  return await api.get(url, null);
}
