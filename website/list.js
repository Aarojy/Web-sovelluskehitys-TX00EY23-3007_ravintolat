import {fetchData} from './utils/fetchData.js';

const selector = document.querySelector('#company');
const form = document.querySelector('form');

const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
let restaurants = [];
let filteredRestaurants = [];

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
    `;
    document.querySelector('#restaurantList').appendChild(restaurantItem);
  });
};

const main = async () => {
  const restaurantList = await getRestaurants(apiUrl);
  createList(restaurantList);
};

main();
