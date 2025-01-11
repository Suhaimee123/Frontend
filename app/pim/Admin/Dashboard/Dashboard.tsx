import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import TabCards from '@/components/TabCards'; // ตรวจสอบ path ให้ถูกต้อง
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  Cell,
} from 'recharts';
import { fetchDashboardData } from '@/app/api/Admin/dashboardApi';

// กำหนดชนิดข้อมูลที่ใช้
interface StatusCountDTO {
  status: string;
  count: number;
  timePeriod: string;  // timePeriod คือเดือน, ปี หรือวัน
}

const Dashboard: React.FC = () => {
  const [statusCountByMonth, setStatusCountByMonth] = useState<StatusCountDTO[]>([]);
  const [statusCountByYear, setStatusCountByYear] = useState<StatusCountDTO[]>([]);
  const [statusCountByDay, setStatusCountByDay] = useState<StatusCountDTO[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData();
        setStatusCountByMonth(data.statusCountByMonth);
        setStatusCountByYear(data.statusCountByYear);
        setStatusCountByDay(data.statusCountByDay);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // แปลงข้อมูลเป็นรูปแบบที่ใช้ในกราฟ
  const processData = (data: StatusCountDTO[], timeUnit: string) => {
    const groupedData = data.reduce((acc: any, item) => {
      const { status, count, timePeriod } = item;
      const key = timeUnit === 'month' ? `เดือน ${timePeriod}` : timeUnit === 'day' ? `วันที่ ${timePeriod}` : timePeriod;
      if (!acc[key]) acc[key] = { name: key, rejected: 0, approved_stage_1: 0, complete: 0, pending: 0 };
      acc[key][status] = acc[key][status] + count;
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const monthData = processData(statusCountByMonth, 'month');
  const yearData = processData(statusCountByYear, 'year');
  const dayData = processData(statusCountByDay, 'day');

  // ฟังก์ชันที่ใช้แสดง label สำหรับสถานะ
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'rejected':
        return 'การสมัครถูกปฏิเสธ';
      case 'approved_stage_1':
        return 'อนุมัติขั้นตอนที่ 1';
      case 'complete':
        return 'เสร็จสมบูรณ์';
      case 'pending':
        return 'รอการอนุมัติ';
      default:
        return 'สถานะไม่ทราบ';
    }
  };

  const statusColors: Record<string, string> = {
    rejected: '#f44336', // สีแดง
    approved_stage_1: '#ffeb3b', // สีเหลือง
    complete: '#4caf50', // สีเขียว
    pending: '#2196f3', // สีน้ำเงิน
  };

  const getStatusColor = (status: string) => statusColors[status] || '#9e9e9e'; // สีเทาสำหรับสถานะไม่ทราบ

  // กำหนด Tabs สำหรับแสดงกราฟ
  const tabs = [
    {
      label: 'กราฟรายเดือน',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { name, rejected, approved_stage_1, complete, pending } = payload[0].payload;
              return (
                <div>
                  <p>{name}</p>
                  <p>{`การสมัครถูกปฏิเสธ: ${rejected}`}</p>
                  <p>{`อนุมัติขั้นตอนที่ 1: ${approved_stage_1}`}</p>
                  <p>{`เสร็จสมบูรณ์: ${complete}`}</p>
                  <p>{`รอการอนุมัติ: ${pending}`}</p>
                </div>
              );
            }} />
            <Legend formatter={(value) => getStatusLabel(value)} />
            {/* แสดงแท่งแยกตามสถานะในกราฟรายเดือน */}
            <Bar dataKey="rejected" fill={getStatusColor('rejected')} />
            <Bar dataKey="approved_stage_1" fill={getStatusColor('approved_stage_1')} />
            <Bar dataKey="complete" fill={getStatusColor('complete')} />
            <Bar dataKey="pending" fill={getStatusColor('pending')} />
            <LabelList
              dataKey="name"
              position="insideBottom"
              content={(props) => {
                const { x, y, width, value } = props;
                if (typeof x === 'number' && typeof y === 'number' && typeof width === 'number') {
                  return (
                    <text x={x + width / 2} y={y + 20} textAnchor="middle" fill="#000">
                      {value}
                    </text>
                  );
                }
                return null;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      label: 'กราฟรายวัน',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { name, rejected, approved_stage_1, complete, pending } = payload[0].payload;
              return (
                <div>
                  <p>{name}</p>
                  <p>{`การสมัครถูกปฏิเสธ: ${rejected}`}</p>
                  <p>{`อนุมัติขั้นตอนที่ 1: ${approved_stage_1}`}</p>
                  <p>{`เสร็จสมบูรณ์: ${complete}`}</p>
                  <p>{`รอการอนุมัติ: ${pending}`}</p>
                </div>
              );
            }} />
            <Legend formatter={(value) => getStatusLabel(value)} />
            {/* แสดงแท่งแยกตามสถานะในกราฟรายวัน */}
            <Bar dataKey="rejected" fill={getStatusColor('rejected')} />
            <Bar dataKey="approved_stage_1" fill={getStatusColor('approved_stage_1')} />
            <Bar dataKey="complete" fill={getStatusColor('complete')} />
            <Bar dataKey="pending" fill={getStatusColor('pending')} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      label: 'กราฟรายปี',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={yearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { name, rejected, approved_stage_1, complete, pending } = payload[0].payload;
              return (
                <div>
                  <p>{name}</p>
                  <p>{`การสมัครถูกปฏิเสธ: ${rejected}`}</p>
                  <p>{`อนุมัติขั้นตอนที่ 1: ${approved_stage_1}`}</p>
                  <p>{`เสร็จสมบูรณ์: ${complete}`}</p>
                  <p>{`รอการอนุมัติ: ${pending}`}</p>
                </div>
              );
            }} />
            <Legend formatter={(value) => getStatusLabel(value)} />
            {/* แสดงแท่งแยกตามสถานะในกราฟรายปี */}
            <Bar dataKey="rejected" fill={getStatusColor('rejected')} />
            <Bar dataKey="approved_stage_1" fill={getStatusColor('approved_stage_1')} />
            <Bar dataKey="complete" fill={getStatusColor('complete')} />
            <Bar dataKey="pending" fill={getStatusColor('pending')} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <main>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            กราฟสรุปข้อมูลการสมัคร
          </Typography>
          <TabCards tabs={tabs} currentStep={selectedTab} onTabChange={setSelectedTab} />
        </Grid>
      </Grid>
    </main>
  );
};

export default Dashboard;
