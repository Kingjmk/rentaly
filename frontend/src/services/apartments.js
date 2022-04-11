import api from 'services/api'

export const search = async ({query, page = 1, page_limit = 25}) => {
  const url = '/core/apartments';

  return await api.get(url, {
    params: {
      area_size: query.area_size,
      price_per_month: query.price_per_month,
      number_of_rooms: query.number_of_rooms,
      page,
      page_limit,
    },
  }, {
    headers: {},
  });
}

export default {
  search,
};
