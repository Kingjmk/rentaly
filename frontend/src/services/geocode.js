import api from 'services/api'

const cleanDisplayName = (value) => {
  const stringToReplace = [
    'palestinian territories', 'west bank', 'area h1', 'area a', 'area b', 'area c',
  ];
  return value.split(', ').reduce((text, v) => {
    if (stringToReplace.includes(v.toLowerCase())) return text;

    return `${text}, ${v}`;
  });
}

export const search = async (address) => {
  const url = '/misc/geocode/locate';
  try {
    const res = await api.get(url, {
      params: {address},
    });

    const data = res.data;

    if (data.length === 0) return null;
    return data.map(place => ({
      ...place,
      lng: place.lon,
      display_name: cleanDisplayName(place.display_name),
    }));
  } catch (e) {
    // TODO: report error
    return [];
  }
}


export const locate = async (address) => {
  const result = await search(address);
  if (result.length === 0) return null;
  return result[0];
}

const geocodeService = {
  search,
  locate,
}

export default geocodeService;
