// api.ts หรือ dashboardApi.ts

import axiosAdmin from "@/utils/axiosAdmin";

export const fetchDashboardData = async () => {
  try {
    const response = await axiosAdmin.get('/Dashboard/summary');
    return response.data; // axios จะคืนค่าใน response.data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // โยนข้อผิดพลาดเพื่อให้ผู้เรียกสามารถจัดการต่อ
  }
};

export const fetchstatisticsData = async () => {
  try {
    const response = await axiosAdmin.get('/Dashboard/activity-statistics');
    return response.data; // axios จะคืนค่าใน response.data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // โยนข้อผิดพลาดเพื่อให้ผู้เรียกสามารถจัดการต่อ
  }
};
