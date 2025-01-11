import axios from 'axios';

const baseURL = process.env.PUBLIC_API_URL;

const axiosApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosApi;
