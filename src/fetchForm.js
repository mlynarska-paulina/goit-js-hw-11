const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41283063-f64ac6cb066a5e4f2bbfae638';

export async function fetchImage(name, page = 1, limit = 40) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation =horizontal&safesearch =true&page=${page}&per_page=${limit}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}
