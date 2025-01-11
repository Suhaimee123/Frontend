// __tests__/api.test.ts
import { User } from "@/types/IResponse";
import axiosApi from "@/utils/Api";

// Update the return type to be an array of User
export const getUser = async (): Promise<User[]> => {
  // Make your API call and ensure it returns an array of users
  const response = await axiosApi.get('/users/get');
  return response.data; // Ensure response.data is an array of User objects
};
