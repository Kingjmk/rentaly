import api, {getToken} from 'services/api'

export const search = async ({query, page = 1, page_limit = 25}) => {
  const url = '/core/apartments/search';

  return await api.get(url, {
    params: {
      ...query,
      page,
      page_limit,
    },
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


export const createImageDropzoneParams = ({apartmentId}, {file, meta}) => {
  const url = `${api.defaults.baseURL}/core/apartments/images/create`;
  const body = new FormData();

  body.append('image', file);
  body.append('apartment', apartmentId);

  return {url, body, headers: {
    Authorization: `Token ${getToken()}`,
  }};
}


export const deleteImage = async (apartmentImageId) => {
  const url = `/core/apartments/images/${apartmentImageId}/delete`;

  return await api.delete(url);
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
  createImageDropzoneParams,
  deleteImage,
};

export default apartmentService;
