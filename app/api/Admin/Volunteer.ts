
import { ApiResponseI, ApiResponseS } from '@/types/IResponse';
import { FormValues } from '@/types/Volunteer';
import axiosAdmin from '@/utils/axiosAdmin';

export const ApiAllVolunteer = {


  deleteVolunteerActivity: async (id: number): Promise<ApiResponseI<null>> => {
    try {
      const response = await axiosAdmin.delete<ApiResponseI<null>>(`/volunteerAdminActivities/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Error deleting volunteer activity.',
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Delete File
  deleteFile: async (imageData: string): Promise<ApiResponseI<null>> => {
    try {
      const response = await axiosAdmin.delete<ApiResponseI<null>>(`/volunteerAdminActivities/deleteFile`, {
        params: { imageData },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Error deleting file.',
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  fetchAllVolunteer: async (offset: number, limit: number, studentId?: string): Promise<ApiResponseS<FormValues[]>> => {
    try {
      const params: { offset: number; limit: number; studentId?: string } = { offset, limit };
      if (studentId) {
        params.studentId = studentId;
      }

      const response = await axiosAdmin.get<ApiResponseS<FormValues[]>>(`/volunteerAdminActivities/All`, {
        params, // Use the parameters directly here
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching students.',
        data: null,
        totalCount: 0,
        error: error instanceof Error ? error.message : 'An unknown error occurred.', // Improved error handling
      };
    }
  },


  fetchAllVolunteerRemove: async (imageData: string): Promise<ApiResponseI<any[]>> => {
    try {
      // Make a DELETE request to the API
      const response = await axiosAdmin.delete<ApiResponseI<any[]>>(`/volunteerAdminActivities/deleteFile`, {
        params: { imageData }, // Send imageData as a query parameter
      });

      // Return the response data directly
      return response.data;
    } catch (error) {
      // Handle errors and return a structured response
      console.error('Error deleting student image:', error); // Log the error for debugging
      return {
        success: false,
        message: 'Failed to delete image.',
        data: null, // Set data to null on error
        error: error instanceof Error ? error.message : 'Unknown error', // Provide detailed error message
      };
    }
  },







  fetchVolunteermages: async (volunteerId: string, imageType: string): Promise<ApiResponseI<any[]>> => {
    try {
      const response = await axiosAdmin.get<ApiResponseI<any[]>>(`volunteerAdminActivities/downloadAllFiles?imageType=${imageType}&volunteerId=${volunteerId}`);

      // Assuming the response from the API includes the images in the data field
      const images = response.data.data || []; // Ensure you access the images from the response

      return {
        success: true,
        message: images.length > 0 ? "Images found" : "No images found",
        data: images,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching student  .',
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred.',
      };
    }
  },

};
