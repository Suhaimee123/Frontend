import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_ADMIN_API_URL; // Fallback if env variable is not found

const axiosAdmin = axios.create({
  baseURL, // Use the admin API URL from the environment
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosAdmin;
