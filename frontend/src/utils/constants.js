const constants = {
  HOST_URL: process.env.REACT_APP_HOST_URL || '/api/v1',
  WEBSITE_NAME: 'Rently',
  WEBSITE_DESCRIPTION: 'Search for an apartment to rent, anywhere',
  AUTHOR_LINK: 'https://github.com/kingjmk',
  TILE_ATTRIBUTION: '&copy; Rently',
  TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  DEFAULT_COORDINATES: {
    lat: 31.904,
    lng: 35.204,
  },
  API_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default constants;
