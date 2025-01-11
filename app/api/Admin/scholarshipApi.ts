import { ApiResponse, ApiResponseI, IResponse } from "@/types/IResponse";
import axiosApi from "@/utils/Api";
import axiosAdmin from "@/utils/axiosAdmin";

// Close Scholarship
export const closeScholarship = async (id: number): Promise<IResponse<null>> => {
  try {
    const response = await axiosAdmin.post<IResponse<null>>(`/scholarship/manage`, null, {
      params: { id, action: 'close' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error closing scholarship:', error.response?.data || error.message);
    return {
      success: false,
      message: '',
      data: null,
      error: error.response?.data?.error || 'Unable to close scholarship',
    };
  }
};

// Open Scholarship
export const openScholarship = async (
  id: number,
  startDate: string,
  endDate: string
): Promise<IResponse<null>> => {
  try {
    const response = await axiosAdmin.post<IResponse<null>>(
      `/scholarship/manage`,
      null,
      {
        params: {
          id,
          action: 'open',
          startDate,
          endDate,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error opening scholarship:', error.response?.data || error.message);
    return {
      success: false,
      message: '',
      data: null,
      error: error.response?.data?.error || 'Unable to open scholarship',
    };
  }
};

// Get Latest Scholarship
export const getLatestScholarship = async (): Promise<IResponse<any>> => {
  try {
    const response = await axiosApi.get<IResponse<any>>(`/scholarship`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching latest scholarship:', error.response?.data || error.message);
    return {
      success: false,
      message: '',
      data: null,
      error: error.response?.data?.error || 'Unable to fetch the latest scholarship',
    };
  }
};


export const uploadFilesApi = async (
  files: File[],
  studentId: string,
  firstName: string,
  fileNames: string[],
  imageType: string,
  endpoint: string = '/scholarship/uploadToGoogleDrive'
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
export const DeleteScholarship = async (id: number): Promise<ApiResponseI<any>> => {
  try {
    // ส่ง DELETE request พร้อมกับ ID ที่ต้องการลบ
    const response = await axiosApi.delete<ApiResponseI<any>>(`/Admin/scholarship/delete/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting scholarship:', error.response?.data || error.message);
    return {
      success: false,
      message: '',
      error: error.response?.data?.error || 'Unable to delete the scholarship',
    };
  }
};
