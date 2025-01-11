import React from 'react';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { Student } from "@/types/Register";

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}




const PartFourPDF: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const { watch } = formMethods;
  const student = watch() as Student;

  const truncateText = (text: string | undefined, maxLength: number): string[] => {
    if (!text) return [];
    const regex = new RegExp(`.{1,${maxLength}}`, 'g'); // แบ่งข้อความเป็นหลายบรรทัด โดยใช้ maxLength
    return text.match(regex) || [];
  };

  const renderField = (
    label: string,
    value: string | undefined,
    width: string,
    maxCharsPerLine: number = 70
  ) => {
    const lines = truncateText(value, maxCharsPerLine);

    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: '15px',
      }}>
        <Box component="label" sx={{
          color: '#000',
          mr: 0.5,
        }}>
          {label}
        </Box>
        <Box sx={{
          width: width,
          maxWidth: '100%',
          borderBottom: '1px dotted #000',
        }}>
          {lines.map((line, index) => (
            <Typography key={index} sx={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>
              {line}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };


  return (
    <Box
      component="form"
      sx={{
        width: '720px',
        height: '116vh', // ใช้ความสูงเต็มที่ของ viewport

        mx: 'auto',
        my: 2,
        '& .MuiGrid-item': {
          paddingTop: '2px !important',
          paddingBottom: '2px !important',
        }
      }}
    >
      <Grid container spacing={0} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Typography
            color="secondary"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ประวัตินักศึกษาและครอบครัวฉัน
          </Typography>
        </Grid>

        <Grid item xs={12} style={{ fontSize: 15 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: '4px' }}>
            {renderField('', student.familyHistory, '100%')}
          </Box>
        </Grid>



        <Grid item xs={12} style={{ fontSize: 15, marginTop: '150px' }}>

          <Typography
            color="secondary"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ขอรับรองว่าเป็นความจริงทุกประการ
          </Typography>

          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography sx={{ whiteSpace: 'nowrap' }}>ลงชื่อ</Typography>
              <Typography>{student.thaiName}</Typography>
              <Typography color="secondary">(ผู้ขอรับทุนฯ)</Typography>
            </Box>
          </Grid>
        </Grid>


      </Grid>
    </Box>
  );
};

export default PartFourPDF;
