import { ApiResponse } from "@/types/IResponse";
import { Student } from "@/types/Register";
import axiosApi from "@/utils/Api";
import axiosAdmin from "@/utils/axiosAdmin";





export const sendStudentAdminDataApi = async (
  studentData: Student,
  endpoint: string = '/student/register' // กำหนด endpoint ที่นี่
): Promise<ApiResponse<any>> => { // ใช้ any ถ้าข้อมูลที่ส่งคืนไม่แน่นอน
  try {
    const response = await axiosAdmin.post<ApiResponse<any>>(endpoint, studentData);

    return {
      success: true,
      message: 'Student data sent successfully',
      data: response.data.data,
    };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || 'Network error' };
  }
};


export const sendRequestDataApi = async (
  studentData: Student,
  endpoint: string = '/students/request' // กำหนด endpoint ที่นี่
): Promise<ApiResponse<any>> => { // ใช้ any ถ้าข้อมูลที่ส่งคืนไม่แน่นอน
  try {
    const response = await axiosApi.post<ApiResponse<any>>(endpoint, studentData);

    return {
      success: true,
      message: 'Student data sent successfully',
      data: response.data.data,
    };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || 'Network error' };
  }
};



export const deleteStudentById = async (id: Number): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosAdmin.delete(`/student/ID/${id}`);
    const { success, message, error } = response.data;

    return {
      success,
      message: message || 'Student deleted successfully',
      error: error || null
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: err.response?.data?.message || err.message || 'Network error',
      error: err.response?.data?.error || err.message || 'An unexpected error occurred'
    };
  }
};
