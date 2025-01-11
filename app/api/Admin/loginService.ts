import { ApiResponse } from '@/types/IResponse';
import { Login } from '@/types/Admin/Admin';
import axiosAdmin from '@/utils/axiosAdmin';

// Define the login API call
export const loginApi = async (formData: Login): Promise<ApiResponse<Login>> => {
  try {
    console.log("Payload being sent:", formData); // Log the payload before making the API request

    const response = await axiosAdmin.post<ApiResponse<Login>>('/Login', formData);

    // Check for successful login
    if (response.data.success) {
      const token = response.data.data?.token; // Access token from data object
      if (token) {
        console.log("Token:", token); // Log the token
        sessionStorage.setItem('token', token); // Store token safely
      } else {
        throw new Error("Token is undefined");
      }
      return response.data; // Return the API response
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Something went wrong';
    console.error('Login API Error:', error.response || errorMessage); // Log error details
    throw new Error(errorMessage);
  }
};
