import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://be-bycourse.vercel.app',
  withCredentials: true, // kalau pakai cookie
});

export default axiosInstance;