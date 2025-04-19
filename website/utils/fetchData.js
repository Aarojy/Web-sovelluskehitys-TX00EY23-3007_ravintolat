export async function fetchData(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    if (response.message) {
      throw new Error(`${json.message}, code:${response.message}`);
    }
    throw new Error(`Error ${response.statusText} occurred`);
  }
  const json = await response.json();
  return json;
}
