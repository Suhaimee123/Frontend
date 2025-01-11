import React from 'react';
import { styled } from '@mui/material/styles';

const StyledContent = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightRegular,
  // display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%', // ใช้ความสูงที่ต้องการ
  width:'100%',
  // marginLeft: '20px',  // Add margin-left
  // marginRight: '50px', // Add margin-right
}));

const StyledTitle = styled('h1')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightBold,
  textAlign: 'center', // เพิ่มการจัดตำแหน่งข้อความให้ตรงกลาง
  marginBottom: '20px', // เพิ่มระยะห่างด้านล่างของ title
}));

const Content: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <StyledContent>
      {title && <StyledTitle>{title}</StyledTitle>} {/* Only render the title if it exists */}
      <div>{children}</div>
    </StyledContent>
  );
};

export default Content;
