import api from 'services/api'

export const list = async ({query, page = 1, page_limit = 25}) => {
  const url = '/users/list';

  return await api.get(url, {
    params: {
      query,
      page,
      page_limit,
    },
  });
}

export const detail = async (id) => {
  const url = `/users/${id}`;

  return await api.get(url);
}

export const create = async (data) => {
  const url = '/users/create';

  return await api.post(url, data);
}


export const update = async (id, data) => {
  const url = `/users/${id}/update`;

  return await api.put(url, data);
}

const userService = {
  list,
  create,
  detail,
  update,
};

export default userService;
