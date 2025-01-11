import React from 'react';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { Student } from "@/types/Register";

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}

const PartTwoPDF: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const { watch, setValue } = formMethods;

  const student = watch() as Student;


  const truncateText = (text: string | number | undefined, maxLength: number): string => {
    if (!text) return '';
    return String(text).substring(0, maxLength);
  };

  const renderField = (
    label: string,
    value: string | number | undefined,
    width: string,
    maxChars?: number
  ) => {
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
        <Typography color="secondary" align="center" >
          ข้อมูลส่วนตัว
        </Typography>
        <Grid item xs={12} style={{ fontSize: 12, }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('Line ID', student.lineId, '100px')}
            {renderField('Facebook', student.facebook, '200px')}
            {renderField('Email', student.email, '220px')}

          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ภูมิลำเนา', student.addressAccordingToHouseRegistration, '100px')}
            {renderField('ตำบล', student.subdistrict, '70px')}
            {renderField('อำเภอ', student.district, '70px')}
            {renderField('จังหวัด', student.province, '80px')}
            {renderField('รหัสไปรษณัย์', student.currentPostalCode, '40px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('วัน/เดือน/ปีเกิด', student.dateOfBirth, '75px')}
            {renderField('เลขบัตรประชาชน/พาสปอรต์', student.nationalId, '150px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('บิดาชื่อ', student.fatherNameSurname, '80px')}
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.fatherStatus === "มีชีวิตอยู่"}
                  onChange={() => setValue('fatherStatus', 'มีชีวิตอยู่')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>มีชีวิตอยู่</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.fatherStatus === "เสียชีวิต"}
                  onChange={() => setValue('fatherStatus', 'เสียชีวิต')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>เสียชีวิต</span>} // Updated to span
            />
            {renderField('เมือ พ.ศ', student.fatherStatusDetails, '80px')}
            {renderField('อาชีพ', student.occupationFather, '70px')}


          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.fatherAddress === "ที่อยุ่เดียวกับนักศึกษา"}
                  onChange={() => setValue('fatherAddress', 'ที่อยุ่เดียวกับนักศึกษา')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>ที่อยุ่เดียวกับนักศึกษา</span>} // Updated to span
            />

            {renderField('ที่อยู่อื่น', student.fatherAddressDetails, '100px')}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('มารดาชื่อ', student.fatherNameSurname, '80px')}
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.maternalStatus === "มีชีวิตอยู่"}
                  onChange={() => setValue('maternalStatus', 'มีชีวิตอยู่')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>มีชีวิตอยู่</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.maternalStatus === "เสียชีวิต"}
                  onChange={() => setValue('maternalStatus', 'เสียชีวิต')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>เสียชีวิต</span>} // Updated to span
            />
            {renderField('เมือ พ.ศ', student.maternalStatusDetails, '80px')}
            {renderField('อาชีพ', student.occupationMother, '70px')}


          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.motherAddress === "ที่อยุ่เดียวกับนักศึกษา"}
                  onChange={() => setValue('motherAddress', 'ที่อยุ่เดียวกับนักศึกษา')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>ที่อยุ่เดียวกับนักศึกษา</span>} // Updated to span
            />

            {renderField('ที่อยู่อื่น', student.motherAddressDetails, '100px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ที่อยู่ปัจจุบัน', student.currentAddress, '70px')}

            <FormControlLabel
              control={
                <Checkbox
                  checked={student.studentResident === "บ้านตนเอง"}
                  onChange={() => setValue('studentResident', 'บ้านตนเอง')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>บ้านตนเอง</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.studentResident === "บ้านญาติ"}
                  onChange={() => setValue('studentResident', 'บ้านญาติ')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>บ้านญาติ</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.studentResident === "บ้านเช่า/หอพัก"}
                  onChange={() => setValue('studentResident', 'บ้านเช่า/หอพัก')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>บ้านเช่า/หอพัก </span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.studentResident === "ยังไม่มี"}
                  onChange={() => setValue('studentResident', 'ยังไม่มี')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>ยังไม่มี</span>}
            />


          </Box>
        </Grid>
        <Grid item xs={12} style={{ fontSize: 15, }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('จำนวนผู้พักอาศัย', student.numberOfResidents, '30px')}
            {renderField('ระบุค่าที่อยู่ต่อเดือนรวมน้ำไฟ', student.addressValue, '50px')}
            {renderField('ค่าเดินทางไป - กลับต่อวัน', student.roundTripTravel, '50px')}

          </Box>
        </Grid>




      </Grid>
    </Box>
  );
};

export default PartTwoPDF;
