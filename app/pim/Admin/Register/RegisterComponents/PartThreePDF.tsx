import React from 'react';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { Student } from "@/types/Register";

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}




const PartThreePDF: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const { watch } = formMethods;
  const student = watch() as Student;

  const truncateText = (text: string | number | undefined, maxLength: number): string => {
    if (!text) return '';
    return String(text).substring(0, maxLength);
  };

  const renderField = (
    label: string,
    value: string | number | undefined,
    width: string,
    maxChars?: number,
    truncate: boolean = true
  ) => {
    const displayedValue = truncate ? truncateText(value, maxChars || 30) : value;
    const truncatedValue = truncateText(value, maxChars || 30);

    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        minWidth: 'fit-content',
        fontSize: '15px',
        flex: 'none',
      }}>
        <Box component="label" sx={{
          whiteSpace: 'nowrap',
          minWidth: 'fit-content',
          color: '#000',
          mr: 0.5,
        }}>
          {label}
        </Box>
        <Box sx={{
          position: 'relative',
          width: width,
          height: '20px',
          mx: '2px',
        }}>
          <Box sx={{
            position: 'absolute',
            top: '2px',
            left: '0',
            width: '100%',
          }}>
            <span style={{ fontSize: 14 }}>{truncatedValue}</span>
          </Box>
          <Box sx={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            borderBottom: '1px dotted #000',
          }} />
        </Box>
      </Box>
    );
  };

  return (
    <Box
      component="form"
      sx={{
        // width: '720px',
        // mx: 'auto',
        // my: 2,
        '& .MuiGrid-item': {
          paddingTop: '2px !important',
          paddingBottom: '2px !important',
        }
      }}
    >
      <Grid container spacing={0}>
        <Typography color="secondary" >
          ภาระค่าใช้จ่าในครอบครัว
        </Typography>
        <Grid item xs={12} style={{ fontSize: 12, }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ค่าผ่อนบ้าน/เช่าบ้าน', '', '50px')}
            {renderField('ค่าใช้จ่ายภายในบ้าน', student.householdExpenses, '50px')}
            {renderField('หนี้สินภายในครอบครัว', student.familyDebt, '50px')}
            {renderField('อื่นๆโปรดระบุ', '', '50px')}

          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography color="secondary" >
            ความสามารถพิเศษ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
          {renderField('', student.talent, '500px', undefined, false)} {/* No truncation */}

          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography color="secondary" >
            งานพิเศษที่เคยทำ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ประถม', student.primaryEducation, '250px')}
            {renderField('มัธยมต้น', student.middleSchool, '250px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('มัธยมปลาย', student.highSchool, '250px')}
            {renderField('ปัจจุบัน', student.current, '250px')}


          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography color="secondary" >
            ความมุงหวังหลังจากจบการศึกษา
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('', student.hope, '500px')} {/* No truncation */}
          </Box>
        </Grid>


        <Grid item xs={12}>
          <Typography color="secondary">
            อยากบอกอะไรกับคณะกรรมการฯ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('', student.committee, '500px')}
          </Box>
        </Grid>



        <Grid item xs={12}>
          <Typography color="secondary">
            นักศึกษาอยากให้ทางกองทุนช่วยเหลือด้านใดบ้าง
          </Typography>

        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ลงชื่อผู้ขอรับทุน', student.thaiName, '250px')}
            {renderField('เบอร์ติดต่อ', student.contactInformation, '250px')}


          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ผู้สามารถติดต่อได้ฉุกเฉิน', student.emergencyContact, '150px')}
            {renderField('ความสัมพันธุ์', student.relationship, '80px')}
            {renderField('เบอรติดต่อ', student.emergencyContactPhoneNumber, '100px')}


          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default PartThreePDF;
