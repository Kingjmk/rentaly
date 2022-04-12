import api from 'services/api'

export const search = async ({query, page = 1, page_limit = 25}) => {
  const url = '/core/apartments/search';

  return await api.get(url, {
    params: {
      ...query,
      page,
      page_limit,
    },
  }, {
    headers: {},
  });
}

export const list = async ({query, page = 1, page_limit = 25}) => {
  const url = '/core/apartments/list';

  return await api.get(url, {
    params: {
      query,
      page,
      page_limit,
    },
  });
}

export const detail = async (id) => {
  const url = `/core/apartments/${id}`;

  return await api.get(url);
}

export const create = async (data) => {
  const url = '/core/apartments/create';

  return await api.post(url, data);
}


export const update = async (id, data) => {
  const url = `/core/apartments/${id}/update`;

  return await api.put(url, data);
}

const apartmentService = {
  search,
  list,
  create,
  detail,
  update,
};

export default apartmentService;
