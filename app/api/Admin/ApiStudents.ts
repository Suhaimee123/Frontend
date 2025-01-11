//api 

import { Student } from '@/types/Register';
import { ApiResponseI, ApiResponseS } from '@/types/IResponse';
import axiosAdmin from '@/utils/axiosAdmin';


export const apiStudents = {
  fetchAllStudents: async (offset: number, limit: number, studentId?: string): Promise<ApiResponseS<Student[]>> => {
    try {
      // Set up params object
      const params: { offset: number; limit: number; studentId?: string } = { offset, limit };
      if (studentId) {
          params.studentId = studentId; // Include studentId if provided
      }

      const response = await axiosAdmin.get<ApiResponseS<Student[]>>('/student/students', {
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

  fetchAllStudentsPasseds: async (offset: number, limit: number, studentId?: string): Promise<ApiResponseS<Student[]>> => {
    try {
      // Set up params object
      const params: { offset: number; limit: number; studentId?: string } = { offset, limit };
      if (studentId) {
          params.studentId = studentId; // Include studentId if provided
      }

      const response = await axiosAdmin.get<ApiResponseS<Student[]>>('/studentPassed/students', {
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

  fetchAllStudentsNotPasseds: async (offset: number, limit: number, studentId?: string): Promise<ApiResponseS<Student[]>> => {
    try {
      // Set up params object
      const params: { offset: number; limit: number; studentId?: string } = { offset, limit };
      if (studentId) {
          params.studentId = studentId; // Include studentId if provided
      }

      const response = await axiosAdmin.get<ApiResponseS<Student[]>>('/studentNotPassed/students', {
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

  fetchAllStudentHistory: async (offset: number, limit: number, studentId?: string): Promise<ApiResponseS<Student[]>> => {
    try {
      // Set up params object
      const params: { offset: number; limit: number; studentId?: string } = { offset, limit };
      if (studentId) {
          params.studentId = studentId; // Include studentId if provided
      }

      const response = await axiosAdmin.get<ApiResponseS<Student[]>>('/StudentHistory/students', {
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

  fetchAllStudentRemove: async (imageData: string): Promise<ApiResponseI<any[]>> => {
    try {
        // Make a DELETE request to the API
        const response = await axiosAdmin.delete<ApiResponseI<any[]>>(`/student/deleteFile`, {
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


  fetchStudentImages: async (studentId: string, imageType: string): Promise<ApiResponseI<any[]>> => {
    try {
      const response = await axiosAdmin.get<ApiResponseI<any[]>>(`/student/downloadAllFiles?studentId=${studentId}&imageType=${imageType}`);

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
        message: 'Error fetching student images.',
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred.',
      };
    }
  },


  

};
