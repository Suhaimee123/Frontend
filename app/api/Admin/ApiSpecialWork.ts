import { ApiResponseI, ApiResponseS } from '@/types/IResponse';
import { FormValues } from '@/types/Volunteer';
import axiosAdmin from '@/utils/axiosAdmin';

export const ApiAllSpecialWork = {

 



  fetchAllSpecialWork: async (offset: number, limit: number, studentId?: string): Promise<ApiResponseS<FormValues[]>> => {
    try {
      const params: { offset: number; limit: number; studentId?: string } = { offset, limit };
      if (studentId){
        params.studentId = studentId;
      }
      const response = await axiosAdmin.get<ApiResponseS<FormValues[]>>(`/specialWorkAdmin/All`, {
        params,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching students.',
        data: null,
        totalCount: 0, 
        error: error instanceof Error ? error.message : 'An unknown error occurred.',
      };
    }
  },
  
  





  fetchSpecialWorkImages: async (specialworkId: string, imageType: string): Promise<ApiResponseS<any[]>> => {
    try {
      const response = await axiosAdmin.get<ApiResponseS<any[]>>(`specialWorkAdmin/downloadAllFiles?imageType=${imageType}&specialworkId=${specialworkId}`);
      
      // Assuming response.data.data contains the list of images
      const images = response.data.data || [];
      const totalCount = images.length; // Calculate the total count based on the length of the images array
  
      return {
        success: true,
        message: images.length > 0 ? "Images found" : "No images found",
        data: images,
        totalCount: totalCount, // Add totalCount to match the type definition
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching images for special work.',
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred.',
        totalCount: 0, // Optional: Return totalCount as 0 in case of error
      };
    }
  },

  fetchAllSpecialWorkRemove: async (imageData: string): Promise<ApiResponseS<any[]>> => {
    try {
        // Make a DELETE request to the API
        const response = await axiosAdmin.delete<ApiResponseS<any[]>>(`/specialWorkAdmin/deleteFile`, {
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
            totalCount: 0, // Provide a default value for totalCount
            data: null, // Set data to null on error
            error: error instanceof Error ? error.message : 'Unknown error', // Provide detailed error message
        };
    }
},


  


  deleteSpecialWork: async (id: number): Promise<ApiResponseS<null>> => {
    try {
      const response = await axiosAdmin.delete<ApiResponseS<null>>(`/specialWorkAdmin/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Error deleting the special work.',
        data: null,
        totalCount: 0,
        error: error instanceof Error ? error.message : 'An unknown error occurred.',
      };
    }
  },

};
