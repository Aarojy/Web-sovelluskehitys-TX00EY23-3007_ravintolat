import {fetchData} from './utils/fetchData.js';
import {getDistance} from 'https://cdn.skypack.dev/geolib';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const selector = document.querySelector('#company');
const sortSelector = document.querySelector('#sortBy');
const form = document.querySelector('form');
let userCrd = null;

const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
let restaurants = [];
let filteredRestaurants = [];

const calculateDistances = () => {
  if (!userCrd) {
    navigator.geolocation.getCurrentPosition(success, error, options);
    return;
  }

  restaurants.forEach((restaurant) => {
    const restaurantLocation = {
      lat: restaurant.location.coordinates[1],
      lon: restaurant.location.coordinates[0],
    };
    restaurant.distance = getDistance(
      {latitude: userCrd.latitude, longitude: userCrd.longitude},
      restaurantLocation
    );
    console.log(userCrd, restaurantLocation);
  });
};

const filterRestaurants = () => {
  const searchInput = document.querySelector('#searchInput').value;
  const selectedCompany = document.querySelector('#company').value;

  if (searchInput !== 'Hae ravintolaa') {
    filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  } else {
    filteredRestaurants = restaurants;
  }

  if (selectedCompany === 'Kaikki') {
    document.querySelector('#restaurantList').innerHTML = '';
    createList(filteredRestaurants);
    return;
  }

  filteredRestaurants = filteredRestaurants.filter(
    (restaurant) => restaurant.company === selectedCompany
  );
  document.querySelector('#restaurantList').innerHTML = '';
  createList(filteredRestaurants);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  filterRestaurants();
});

selector.addEventListener('change', () => {
  filterRestaurants();
});

sortSelector.addEventListener('change', () => {
  if (filteredRestaurants.length === 0) {
    filteredRestaurants = restaurants;
  }

  const selectedOption = sortSelector.value;
  if (selectedOption === 'alphabetical') {
    filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedOption === 'closest') {
    filteredRestaurants.sort((a, b) => a.distance - b.distance);
  } else if (selectedOption === 'farthest') {
    filteredRestaurants.sort((a, b) => b.distance - a.distance);
  } else if (selectedOption === 'random') {
    filteredRestaurants.sort(() => Math.random() - 0.5);
  }

  document.querySelector('#restaurantList').innerHTML = '';
  createList(filteredRestaurants);
});

async function getRestaurants(apiUrl) {
  try {
    restaurants = await fetchData(apiUrl + '/restaurants/');
    return restaurants;
  } catch (error) {
    console.error(error.message);
  }
}

const createList = (restaurants) => {
  restaurants.forEach((restaurant) => {
    const restaurantItem = document.createElement('li');
    restaurantItem.classList.add('restaurant-item');
    restaurantItem.innerHTML = `
      <h2>${restaurant.name}</h2>
      <p>Kaupunki: ${restaurant.city}</p>
      <p>Osoite: ${restaurant.address}</p>
      <p>Puhelinnumero: ${restaurant.phone}</p>
      <p>Firma: ${restaurant.company}</p>
      <p>Etäisyys: ${
        restaurant.distance
          ? restaurant.distance / 1000 + ' km'
          : 'Ei saatavilla'
      }</p>
    `;
    document.querySelector('#restaurantList').appendChild(restaurantItem);
  });
};

function success(pos) {
  userCrd = pos.coords;
  document.querySelector('#restaurantList').innerHTML = '';
  calculateDistances();
  createList(restaurants);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const main = async () => {
  restaurants = await getRestaurants(apiUrl);
  navigator.geolocation.getCurrentPosition(success, error, options);
  createList(restaurants);
};

main();
