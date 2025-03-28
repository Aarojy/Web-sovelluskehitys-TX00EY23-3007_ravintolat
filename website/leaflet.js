// eslint-disable-next-line no-undef
const map = L.map('map').setView([60.2248735, 25.0773476], 14.5);

// eslint-disable-next-line no-undef
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
