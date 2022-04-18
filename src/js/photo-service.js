const axios = require('axios');

const API_KEY = '26815129-636df5f0482082ec4ff5cd1a9';
const BASE_URL = 'https://pixabay.com/api/';

export class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async axios() {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`,
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
