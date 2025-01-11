import { ApiAllSpecialWork } from '@/app/api/Admin/ApiSpecialWork';


import { ApiResponseI } from '@/types/IResponse';
import { useState } from 'react';


export const useSpecialWorkImages = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSpecialWorkImages = async (volunteerId: string , imageType: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: ApiResponseI<any[]> = await ApiAllSpecialWork.fetchSpecialWorkImages(volunteerId,imageType);
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

    return { images, loading, error, fetchSpecialWorkImages };
};
