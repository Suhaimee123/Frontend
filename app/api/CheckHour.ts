import { VolunteerHoursResponse, SpecialWorkResponse } from '@/types/IResponse';
import axiosApi from '@/utils/Api'; // Ensure axiosApi is configured 



// Function to fetch volunteer hours based on student ID
export const fetchVolunteerHours = async (studentId: string): Promise<VolunteerHoursResponse[]> => {
  try {
    const response = await axiosApi.get<VolunteerHoursResponse[]>(`/volunteer-activities/student/${studentId}`);
    return response.data; // Return the data from the API response
  } catch (error) {
    throw new Error('Error fetching volunteer hours');
  }
};

// Function to fetch special work hours based on student ID
export const fetchSpecialWorkHours = async (studentId: string): Promise<SpecialWorkResponse[]> => {
  try {
    const response = await axiosApi.get<SpecialWorkResponse[]>(`/special-work/student/${studentId}`);
    return response.data; // Return the data from the API response
  } catch (error) {
    throw new Error('Error fetching special work hours');
  }
};
