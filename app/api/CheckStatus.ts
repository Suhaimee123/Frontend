import { ApiResponse } from "@/types/IResponse";
import { StudentStatus } from "@/types/Status";
import axiosApi from "@/utils/Api";

export const fetchStudentStatus = async (studentId: string): Promise<{
  success: boolean;
  data: StudentStatus[] | null;
  message: string | null;
  error: string | null;
}> => {
  try {
    const response = await axiosApi.get(`/students/status/${studentId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
    };
  }
};
