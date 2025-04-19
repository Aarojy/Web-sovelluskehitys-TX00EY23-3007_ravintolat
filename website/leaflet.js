// eslint-disable-next-line no-undef
const map = L.map('map').setView([60.2248735, 25.0773476], 14.5);

// eslint-disable-next-line no-undef
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

const addMarker = (lat, lon, company, name, onClickCallback) => {
  let iconUrl = '';

  if (company === 'Sodexo') {
    iconUrl = './resources/sodexoIcon.png';
  } else if (company === 'Compass Group') {
    iconUrl = './resources/compassIcon.png';
  }

  // eslint-disable-next-line no-undef
  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });

  // eslint-disable-next-line no-undef
  const marker = L.marker([lat, lon], {icon: customIcon}).addTo(map);
  marker.bindPopup(name, {autoPan: false});
  marker.openPopup();

  marker.on('click', function () {
    if (onClickCallback) {
      onClickCallback(name);
    }
  });
};

export {addMarker};
