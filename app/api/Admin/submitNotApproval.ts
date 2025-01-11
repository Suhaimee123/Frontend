import axiosAdmin from '@/utils/axiosAdmin';
import { ApprovalData } from '@/types/Admin/Admin';
import { ApiResponseI } from '@/types/IResponse';

export const submitNotApproval = async (data: ApprovalData): Promise<ApiResponseI<any>> => {
  const { studentId, approve, approvedBy, appointmentDate , applicationId  } = data;

  // Construct the base URL
  let url = `/studentNotPassed/approve/${studentId}?applicationId=${applicationId}&approve=${approve}&approvedBy=${encodeURIComponent(approvedBy)}`;

  // Conditionally add appointmentDate and endAppointmentDate if they exist
  if (appointmentDate) {
    url += `&appointmentDate=${encodeURIComponent(appointmentDate)}`;
  }


  

  try {
    // Send the request to the constructed URL
    const response = await axiosAdmin.post<ApiResponseI<any>>(url);
    return response.data;
  } catch (error) {
    console.error("Error submitting approval data:", error);
    throw error;  // Re-throw error for handling in the component
  }
};
