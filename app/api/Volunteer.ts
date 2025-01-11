import { ApiResponse } from '@/types/IResponse';
import axiosApi from '@/utils/Api'; // Ensure axiosApi is properly configured

// Function to handle volunteer form submission
export const submitVolunteerForm = async (formData: any) => {
  try {
    console.log(formData)
    const response = await axiosApi.post("/volunteer-activities/create", formData);
    return response.data; // Return the data from the API response
  } catch (error) {
    throw new Error('Error submitting the volunteer form');
  }
};





export const uploadVolunteerFilesApi = async (
  files: File[],
  studentId: string,
  firstName: string,
  fileNames: string[],
  imageType: string,
  id:number,

  endpoint: string = '/volunteer-activities/uploadToGoogleDrive'
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
  formData.append('volunteerId', id.toString());


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
  



