// Loading.tsx
import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

type Props = {
    open: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
};

const Loading: React.FC<Props> = ({ open, containerRef }) => {
    if (!open || !containerRef.current) return null; // ไม่แสดงอะไรหากไม่อยู่ในสถานะการโหลดหรือ ref ไม่มีค่า

    return (
        <Backdrop
            sx={{ color: '#000000FF', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            style={{
                position: 'absolute', // ใช้ absolute positioning
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // ให้พื้นหลังบางส่วนโปร่งใส
            }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default Loading;
