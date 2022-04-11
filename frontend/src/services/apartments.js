import api from 'services/api'

export const search = async ({query, page = 1, limit = 25}) => {
  const url = '/core/apartments';

  return await api.get(url, {
    page,
    page_limit: limit,
    ...query,
  }, {
    headers: {},
  });
}
