//hooks
import { useState } from 'react';
import { ApiResponseI } from '@/types/IResponse';
import { apiStudents } from '@/app/api/Admin/ApiStudents';

export const useDeleteStudentImage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchDeleteStudent = async (imageData: string): Promise<ApiResponseI<any[]>> => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await apiStudents.fetchAllStudentRemove(imageData);
            
            if (response.success) {
                setSuccessMessage("Image deleted successfully.");
            } else {
                setError(response.error || "Failed to delete image.");
            }

            return response;
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unknown error occurred.");
            return {
                success: false,
                message: "Failed to delete image.",
                data: null,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fetchDeleteStudent,
        isLoading,
        error,
        successMessage,
    };
};
