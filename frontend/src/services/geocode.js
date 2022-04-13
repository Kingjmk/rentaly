import api from 'services/api'


export const locate = async (address) => {
  const url = '/misc/geocode/locate';
  try {
    const res = await api.get(url, {
      params: {address},
    });

    const data = res.data;

    if (data.length === 0) return null;
    return data[0];
  } catch (e) {
    // TODO: report error
    return null;
  }

}

const geocodeService = {
  locate,
}

export default geocodeService;
