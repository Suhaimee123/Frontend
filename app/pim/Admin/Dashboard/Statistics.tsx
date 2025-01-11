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
import { fetchstatisticsData } from '@/app/api/Admin/dashboardApi';

// กำหนดชนิดข้อมูลที่ใช้
interface StatusCountDTO {
  status: string;
  count: number;
  timePeriod: string;  // timePeriod คือเดือน, ปี หรือวัน
}

const Statistics: React.FC = () => {
  const [statusCountByMonth, setStatusCountByMonth] = useState<StatusCountDTO[]>([]);
  const [statusCountByYear, setStatusCountByYear] = useState<StatusCountDTO[]>([]);
  const [statusCountByDay, setStatusCountByDay] = useState<StatusCountDTO[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchstatisticsData();
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
      if (!acc[key]) acc[key] = { name: key, volunteer: 0, special: 0 };
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
      case 'volunteer':
        return 'จิตอาสา';
      case 'special':
        return 'งานพิเศษ';
      default:
        return 'สถานะไม่ทราบ';
    }
  };

  const statusColors: Record<string, string> = {
    special: '#ffeb3b', // สีเหลือง
    volunteer: '#4caf50', // สีเขียว
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
              const { name, volunteer, special} = payload[0].payload;
              return (
                <div>
                  <p>{name}</p>
                  <p>{`จิตอาสา: ${volunteer}`}</p>
                  <p>{`งานพิเศษ: ${special}`}</p>

                </div>
              );
            }} />
            <Legend formatter={(value) => getStatusLabel(value)} />
            {/* แสดงแท่งแยกตามสถานะในกราฟรายเดือน */}
            <Bar dataKey="volunteer" fill={getStatusColor('volunteer')} />
            <Bar dataKey="special" fill={getStatusColor('special')} />

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
              const { name, volunteer, special} = payload[0].payload;
              return (
                <div>
                  <p>{name}</p>
                  <p>{`จิตอาสา: ${volunteer}`}</p>
                  <p>{`งานพิเศษ: ${special}`}</p>

                </div>
              );
            }} />
            <Legend formatter={(value) => getStatusLabel(value)} />
            {/* แสดงแท่งแยกตามสถานะในกราฟรายวัน */}
            <Bar dataKey="volunteer" fill={getStatusColor('volunteer')} />
            <Bar dataKey="special" fill={getStatusColor('special')} />
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
              const { name, volunteer, special} = payload[0].payload;
              return (
                <div>
                  <p>{name}</p>
                  <p>{`จิตอาสา: ${volunteer}`}</p>
                  <p>{`งานพิเศษ: ${special}`}</p>

                </div>
              );
            }} />
            <Legend formatter={(value) => getStatusLabel(value)} />
            {/* แสดงแท่งแยกตามสถานะในกราฟรายปี */}
            <Bar dataKey="volunteer" fill={getStatusColor('volunteer')} />
            <Bar dataKey="special" fill={getStatusColor('special')} />
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
            กราฟสรุปข้อมูลการบันทึกจิตอาสาและงานพิเศษ
          </Typography>
          {/* ใช้ TabCards สำหรับแสดงกราฟ */}
          <TabCards tabs={tabs} currentStep={selectedTab} onTabChange={setSelectedTab} />
        </Grid>
      </Grid>
    </main>
  );
};

export default Statistics;
