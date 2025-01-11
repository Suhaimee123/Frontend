import { closeScholarship, openScholarship } from '@/app/api/Admin/scholarshipApi';
import { IResponse } from '@/types/IResponse';
import { useState, useCallback } from 'react';

interface UseScholarshipResult {
  loading: boolean;
  error: string | null;
  closeScholarshipHandler: (id: number) => Promise<IResponse<null>>;
  openScholarshipHandler: (id: number, startDate: string, endDate: string) => Promise<IResponse<null>>;
}

export const useScholarship = (): UseScholarshipResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const closeScholarshipHandler = useCallback(async (id: number): Promise<IResponse<null>> => {
    setLoading(true);
    setError(null);
    try {
      return await closeScholarship(id);
    } catch (err: any) {
      setError(err.message || 'Unable to close scholarship');
      return {
        success: false,
        message: '',
        data: null,
        error: err.message || 'Unable to close scholarship',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const openScholarshipHandler = useCallback(async (
    id: number,
    startDate: string,
    endDate: string
  ): Promise<IResponse<null>> => {
    setLoading(true);
    setError(null);
    try {
      return await openScholarship(id, startDate, endDate);
    } catch (err: any) {
      setError(err.message || 'Unable to open scholarship');
      return {
        success: false,
        message: '',
        data: null,
        error: err.message || 'Unable to open scholarship',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    closeScholarshipHandler,
    openScholarshipHandler,
  };
};
