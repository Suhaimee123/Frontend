import { useState } from 'react';
import { ApiResponseS } from '@/types/IResponse';
import { Scholarship } from '@/types/Admin/scholarship';
import { apiScholarship } from '@/app/api/Admin/scholarshipApiImg';

export const useScholarshipImg = (setPaginationModel: unknown) => {
    const [scholarship, setScholarship] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchScholarship = async (offset: number, limit: number, studentId?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponseS<Scholarship[]> = await apiScholarship.fetchAllScholarship(offset, limit,studentId);
            if (response.success) {
                const retrievedStudents = response.data || []; // Access the students array
                console.log('Fetched students:', retrievedStudents);
                setScholarship(retrievedStudents);
                setTotalCount(response.totalCount); // Set the totalCount based on API response
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch student data.');
        } finally {
            setLoading(false);
        }
    };

    return { scholarship, loading, error, totalCount, fetchScholarship };
};
