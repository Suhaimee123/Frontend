import { useState } from 'react';
import { ApiResponseS } from '@/types/IResponse';
import { ApiAllVolunteer } from '@/app/api/Admin/Volunteer';
import { FormValues } from '@/types/Volunteer';



export const volunteer = (setPaginationModel: unknown) => {
    const [Volunteer, setStudents] = useState<FormValues[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchvolunteer = async (offset: number, limit: number ,studentId?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponseS<FormValues[]> = await ApiAllVolunteer.fetchAllVolunteer(offset, limit,studentId);
            if (response.success) {
                const retrievedStudents = response.data || []; // Access the students array
                console.log('Fetched students:', retrievedStudents);
                setStudents(retrievedStudents);
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

    return { Volunteer, loading, error, totalCount, fetchvolunteer };
};
