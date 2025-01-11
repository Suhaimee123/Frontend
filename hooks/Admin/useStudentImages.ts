import { useState } from 'react';
import { ApiResponseI } from '@/types/IResponse';
import { apiStudents } from '@/app/api/Admin/ApiStudents';

export const useStudentImages = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStudentImages = async (studentId: string , imageType: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponseI<any[]> = await apiStudents.fetchStudentImages(studentId,imageType);
            if (response.success) {
                const retrievedImages = response.data || []; // Ensure this is always an array
                console.log('Fetched student images:', retrievedImages);
                setImages(retrievedImages);
            } else {
                console.error('Error fetching student images:', response.message);
                setError(response.message);
            }
        } catch (err) {
            console.error('Failed to fetch student images:', err);
            setError('Failed to fetch student images.');
        } finally {
            setLoading(false);
        }
    };

    return { images, loading, error, fetchStudentImages };
};
