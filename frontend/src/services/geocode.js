import api from 'services/api'


export const locate = async (address) => {
  const url = '/misc/geocode/locate';
  try {
    const res = await api.get(url, {
      params: {address},
    });

    const data = res.data.data;

    if (data.length === 0) return null;
    return {
      lat: data[0].latitude,
      lng: data[0].longitude,
    };
  } catch (e) {
    // TODO: report error
    return null;
  }

}

const geocodeService = {
  locate,
}

export default geocodeService;
