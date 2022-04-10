import api from 'services/api'

export const search = async ({query, page, limit}) => {
  const url = '/core/apartments';

  return await api.get(url, {}, {
    headers: {},
  });
}
