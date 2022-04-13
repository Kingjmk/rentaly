import api, {getToken} from 'services/api'

export const search = async ({query, page = 1, page_limit = 25}) => {
  const url = '/apartments/search';

  return await api.get(url, {
    params: {
      ...query,
      page,
      page_limit,
    },
  });
}

export const list = async ({query, page = 1, page_limit = 25}) => {
  const url = '/apartments/list';

  return await api.get(url, {
    params: {
      query,
      page,
      page_limit,
    },
  });
}

export const detail = async (id) => {
  const url = `/apartments/${id}`;

  return await api.get(url);
}

export const create = async (data) => {
  const url = '/apartments/create';

  return await api.post(url, data);
}


export const createImageDropzoneParams = ({apartmentId}, {file, meta}) => {
  const url = `${api.defaults.baseURL}/apartments/images/create`;
  const body = new FormData();

  body.append('image', file);
  body.append('apartment', apartmentId);

  return {url, body, headers: {
    Authorization: `Token ${getToken()}`,
  }};
}


export const deleteImage = async (apartmentImageId) => {
  const url = `/apartments/images/${apartmentImageId}/delete`;

  return await api.delete(url);
}


export const update = async (id, data) => {
  const url = `/apartments/${id}/update`;

  return await api.put(url, data);
}

const apartmentService = {
  search,
  list,
  create,
  detail,
  update,
  createImageDropzoneParams,
  deleteImage,
};

export default apartmentService;
