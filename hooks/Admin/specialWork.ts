import { useState } from 'react';
import { ApiResponseS } from '@/types/IResponse';
import { FormValues } from '@/types/Volunteer';
import { ApiAllSpecialWork } from '@/app/api/Admin/ApiSpecialWork';

export const specialWork = (setPaginationModel: unknown) => {
    const [SpecialWork, setSpecialWork] = useState<FormValues[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchSpecialWork = async (offset: number, limit: number, studentId?: string) => {
        setLoading(true);
        setError(null);
        try {
            // เรียกใช้ API เพื่อดึงข้อมูลกิจกรรมพิเศษ
            const response: ApiResponseS<FormValues[]> = await ApiAllSpecialWork.fetchAllSpecialWork(offset, limit, studentId);
            if (response.success) {
                const retrievedSpecialWork = response.data || []; // ดึงข้อมูลกิจกรรมพิเศษ
                console.log('Fetched special work:', retrievedSpecialWork);
                setSpecialWork(retrievedSpecialWork); // ตั้งค่า state
                setTotalCount(response.totalCount); // ตั้งค่าจำนวนทั้งหมดที่ได้จาก API
            } else {
                setError(response.message); // ถ้า API ตอบล้มเหลว
            }
        } catch (err) {
            setError('Failed to fetch special work data.'); // กรณีเกิดข้อผิดพลาดในการเรียก API
        } finally {
            setLoading(false); // หมดเวลาการโหลดแล้ว
        }
    };

    return { SpecialWork, loading, error, totalCount, fetchSpecialWork };
};
