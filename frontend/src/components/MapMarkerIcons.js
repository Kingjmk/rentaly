import * as L from 'leaflet';

export const LeafIcon = L.Icon.extend({
  options: {},
});

export const successIcon = new LeafIcon({
  iconUrl: require('assets/leaflet/marker-icon-success.png'),
});

export const warningIcon = new LeafIcon({
  iconUrl: require('assets/leaflet/marker-icon-warning.png'),
});
