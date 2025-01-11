//api 

import { ApiResponseI, ApiResponseS } from '@/types/IResponse';
import axiosAdmin from '@/utils/axiosAdmin';
import { Scholarship } from '@/types/Admin/scholarship';


export const apiScholarship = {
  fetchAllScholarship: async (offset: number, limit: number, studentId?: string): Promise<ApiResponseS<Scholarship[]>> => {
    try {
      // Set up params object
      const params: { offset: number; limit: number; studentId?: string } = { offset, limit };
      if (studentId) {
          params.studentId = studentId; // Include studentId if provided
      }

      const response = await axiosAdmin.get<ApiResponseS<Scholarship[]>>('/scholarship/All', {
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








  

};
