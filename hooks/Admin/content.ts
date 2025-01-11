import { download } from '@/app/api/Admin/Post';
import { ApiResponseI, PostResponse } from '@/types/IResponse';
import { useState } from 'react';
// Make sure this is the correct path to your API file

export const usePostImages = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch images using the download API
  const fetchPostImages = async (imageType: string) => {
    setLoading(true);
    setError(null);
    try {
      // Call the download function and wait for the response
      const response: PostResponse = await download(imageType);

      if (response.success) {
        const retrievedImages = response.data || []; // Ensure this is always an array
        console.log('Fetched images:', retrievedImages);
        setImages(retrievedImages);
      } else {
        console.error('Error fetching images:', response.message);
        setError(response.message);
      }
    } catch (err: any) {
      console.error('Failed to fetch images:', err);
      setError(err?.message || 'Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };

  return { images, loading, error, fetchPostImages };
};
