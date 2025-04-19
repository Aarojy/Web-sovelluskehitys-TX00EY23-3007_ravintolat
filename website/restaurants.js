import {fetchData} from './utils/fetchData.js';

const apiUrl = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
let restaurants = [];

async function getRestaurants() {
  try {
    restaurants = await fetchData(apiUrl + '/restaurants/');
  } catch (error) {
    console.error(error.message);
  }
}

async function main() {
  try {
    await getRestaurants();
  } catch (error) {
    console.error(error.message);
  }
  console.log('Restaurants:', restaurants);
}

main();
