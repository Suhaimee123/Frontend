import axiosApi from "@/utils/Api";

export interface RankinResponse {
  studentId: string;
  totalHours: number;
  rank: number;
}

// Modify fetchRankinActivity to accept studentId as a parameter
export const fetchRankinActivity = async (studentId: string): Promise<RankinResponse[] | null> => {
  try {
    // Use axiosApi to make a GET request with studentId as a query parameter
    const response = await axiosApi.get<RankinResponse[]>('/rankin/activity', {
      params: { studentId }, // Pass studentId to filter ranking for the specific student
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the filtered ranking data for the specific student
    return response.data;
  } catch (error) {
    console.error('Error fetching ranking data:', error);
    return null;
  }
};
