

import { ApiResponse } from '@/types/IResponse';
import axiosApi from '@/utils/Api'; // Ensure axiosApi is properly configured

// Function to handle special-work form submission
export const submitSpecialWorkForm = async (formData: any) => {
  try {
    console.log('Submitting form with data:', formData);
    const response = await axiosApi.post("/special-work/create", formData);
    return response.data;
  } catch (error: any) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    throw new Error('Error submitting the special-work form');
  }
};


// API function to upload files
export const uploadFilesWorkApi = async (
  files: File[],
  studentId: string,
  firstName: string,
  fileNames: string[],
  imageType: string,
  id:number,

  endpoint: string = '/special-work/uploadToGoogleDrive'
): Promise<ApiResponse<any>> => { // ใช้ any ถ้าข้อมูลที่ส่งคืนไม่แน่นอน
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('studentId', studentId);
  formData.append('firstName', firstName);
  fileNames.forEach(name => {
    formData.append('imageName[]', name);
  });
  formData.append('imageType', imageType);
  formData.append('specialworkId', id.toString());

  try {
    const response = await axiosApi.post<ApiResponse<any>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      message: 'Files uploaded successfully',
      data: response.data.data,
    };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || 'Network error' };
  }
};