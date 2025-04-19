import {fetchData} from './utils/fetchData.js';
import {addMarker} from './leaflet.js';

const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
let restaurants = [];

async function getRestaurants() {
  try {
    restaurants = await fetchData(apiUrl + '/restaurants/');
  } catch (error) {
    console.error(error.message);
  }
}

const addRestaurantMarkers = (restaurants) => {
  restaurants.forEach((restaurant) => {
    const {location, name} = restaurant;
    addMarker(location.coordinates[1], location.coordinates[0], name);
  });
};

async function main() {
  try {
    await getRestaurants();
  } catch (error) {
    console.error(error.message);
  }
  console.log('Restaurants:', restaurants);
  addRestaurantMarkers(restaurants);
}

main();
