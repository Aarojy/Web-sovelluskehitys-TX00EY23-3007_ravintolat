import {fetchData} from './utils/fetchData.js';

const selector = document.querySelector('#company');
const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
let restaurants = [];
let filteredRestaurants = [];

selector.addEventListener('change', async (event) => {
  const selectedCompany = event.target.value;
  const restaurantList = await getRestaurants(apiUrl);

  if (selectedCompany === 'Kaikki') {
    document.querySelector('#restaurantList').innerHTML = '';
    createList(restaurantList);
    return;
  }

  filteredRestaurants = restaurantList.filter(
    (restaurant) => restaurant.company === selectedCompany
  );
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
    `;
    document.querySelector('#restaurantList').appendChild(restaurantItem);
  });
};

const main = async () => {
  const restaurantList = await getRestaurants(apiUrl);
  createList(restaurantList);
};

main();
