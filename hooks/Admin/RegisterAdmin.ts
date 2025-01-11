// hooks/RegisterH.ts
import { useState } from 'react';
import { Student } from '@/types/Register';
import { sendStudentAdminDataApi } from '@/app/api/Admin/RegisterAdmin';
import { SendEmailApi, uploadFilesApi } from '@/app/api/Register';

// Define the response type for the backend
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Custom hook for managing student API calls
export const useStudentAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const sendStudentData = async (studentData: Student): Promise<ApiResponse | null> => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await sendStudentAdminDataApi(studentData); // Use the API function

      if (result.success) {
        setResponse(result); // Save response
        return result; // Return the result
      } else {
        setError(result.message);
        return null; // Return null in case of error
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      return null; // Return null in case of exception
    } finally {
      setLoading(false);
    }
  };




  const uploadFiles = async (
    files: File[],
    studentId: string,
    id : string,
    firstName: string,
    imageType: string
  ) => {
    setLoading(true);
    setError(null);
  
    try {
      const fileNames = files.map(file => file.name);
      const result = await uploadFilesApi(files, studentId,id, firstName, fileNames, imageType);
  
      if (!result.success) {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };



  const sendEmail = async (studentId: string, email: string, firstName: string): Promise<ApiResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await SendEmailApi(studentId, email, firstName); // Use the API function

      if (result.success) {
        setResponse(result); // Save response
        return result; // Return the result
      } else {
        setError(result.message);
        return null; // Return null in case of error
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      return null; // Return null in case of exception
    } finally {
      setLoading(false);
    }
  };
  

  return {
    loading,
    error,
    response,
    sendStudentData,
    uploadFiles, // Export the uploadFiles function
    sendEmail,
  };
};