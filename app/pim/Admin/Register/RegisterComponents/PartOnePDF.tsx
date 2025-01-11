import React from 'react';
import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { Student } from "@/types/Register";

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}

const PartOnePDF: React.FC<RegisterFormProps> = ({ formMethods }) => {
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
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('คำนำหน้า', student.prefix, '35px')}
            {renderField('ชื่อ', student.thaiName, '100px')}
            {renderField('นามสกุล', student.lastName, '100px')}
            {renderField('ชื่อเล่น', student.nickname, '50px')}
            {renderField('รหัสนักเรียน', student.studentId, '70px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ปีที่กำลังศึกษา', student.currentlyStudyingYear, '35px')}
            {renderField('Block', student.block, '50px')}
            {renderField('คณะ', student.faculty, '200px')}
            {renderField('สาขาวิชา', student.fieldOfStudy, '200px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('ทุนการศึกษาที่ได้รับ', student.scholarshipReceived, '70px')}
            {renderField('ทุนการศึกษาอื่น ๆ', student.otherScholarships, '70px')}
            {renderField('เกรดเฉลี่ยปัจจุบัน', student.currentGpa, '50px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('อาจารย์ที่ปรึกษา ชื่อ - นามสกุล', student.advisorNameSurname, '220px')}
            {renderField('เบอร์โทรอาจารย์ที่ปรึกษาฯ', student.advisorPhoneNumber, '100px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', columnGap: '4px' }}>
            {renderField('จบจากโรงเรียน', student.graduatedFromSchool, '180px')}
            {renderField('ตำบล', '', '70px')}
            {renderField('อำเภอ', '', '70px')}
            {renderField('จังหวัด', student.province, '90px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box style={{ fontSize: 15, display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px' }}>สถานที่เรียน</label>

            <FormControlLabel
              control={
                <Checkbox
                  checked={student.placeOfStudy === "แจ้งวัฒนะ"}
                  onChange={() => setValue('placeOfStudy', 'แจ้งวัฒนะ')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>แจ้งวัฒนะ</span>}
              sx={{ marginRight: '10px' }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={student.placeOfStudy === "วิทยาเขต EEC"}
                  onChange={() => setValue('placeOfStudy', 'วิทยาเขต EEC')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>วิทยาเขต EEC</span>}
              sx={{ marginRight: '10px' }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={student.placeOfStudy === "ศูนย์การเรียน"}
                  onChange={() => setValue('placeOfStudy', 'ศูนย์การเรียน')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>ศูนย์การเรียน จังหวัด</span>}
              sx={{ marginRight: '10px' }}
            />

            {/* Render the 'สถานที่ศึกษาอื่นๆ' field in the same row */}
            {renderField('สถานที่ศึกษาอื่นๆ', student.otherPlace, '40px')}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box style={{ fontSize: 15, display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px' }}>ทุนกู้ยืมเพื่อการศึกษา</label>
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.educationLoan === "กยศ"}
                  onChange={() => setValue('educationLoan', 'กยศ')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>กยศ</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.educationLoan === "กรอ"}
                  onChange={() => setValue('educationLoan', 'กรอ')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>กรอ</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.educationLoan === "ไม่ได้กู้"}
                  onChange={() => setValue('educationLoan', 'ไม่ได้กู้')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>ไม่ได้กู้</span>} // Updated to span
            />


          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box style={{ fontSize: 15 }} >
            <label style={{ marginRight: '10px' }}>รู้จักกองทุน PIM SMART จาก</label>
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.knowThePimSmartFundFrom === "คุณครูแนะแนวโรงเรียนมัธยม"}
                  onChange={() => setValue('knowThePimSmartFundFrom', 'คุณครูแนะแนวโรงเรียนมัธยม')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>คุณครูแนะแนวโรงเรียนมัธยม</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.knowThePimSmartFundFrom === "ทีมแนะแนว"}
                  onChange={() => setValue('knowThePimSmartFundFrom', 'ทีมแนะแนว')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 15 }}>ทีมแนะแนว</span>} // Updated to span
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={student.knowThePimSmartFundFrom === "LINE OA"}
                  onChange={() => setValue('knowThePimSmartFundFrom', 'LINE OA')}
                  sx={{
                    transform: 'scale(0.8)', // Reduces the checkbox size
                    padding: '4px', // Reduces padding around the checkbox
                  }}
                />
              }
              label={<span style={{ fontSize: 12 }}>LINE OA</span>} // Updated to span
            />
          </Box>

          <Box style={{ fontSize: 15, display: 'flex' }}>


          <FormControlLabel
            control={
              <Checkbox
                checked={student.knowThePimSmartFundFrom === "FACEBOOK"}
                onChange={() => setValue('knowThePimSmartFundFrom', 'FACEBOOK')}
                sx={{
                  transform: 'scale(0.8)', // Reduces the checkbox size
                  padding: '4px', // Reduces padding around the checkbox
                }}
              />
            }
            label={<span style={{ fontSize: 12 }}>FACEBOOK</span>} // Updated to span
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={student.knowThePimSmartFundFrom === "อาจารย์ที่ปรึกษา"}
                onChange={() => setValue('knowThePimSmartFundFrom', 'อาจารย์ที่ปรึกษา')}
                sx={{
                  transform: 'scale(0.8)', // Reduces the checkbox size
                  padding: '4px', // Reduces padding around the checkbox
                }}
              />
            }
            label={<span style={{ fontSize: 15 }}>อาจารย์ที่ปรึกษา</span>} // Updated to span
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={student.knowThePimSmartFundFrom === "เพื่อนในกองทุน PIM SMART"}
                onChange={() => setValue('knowThePimSmartFundFrom', 'เพื่อนในกองทุน PIM SMART')}
                sx={{
                  transform: 'scale(0.8)', // Reduces the checkbox size
                  padding: '4px', // Reduces padding around the checkbox
                }}
              />
            }
            label={<span style={{ fontSize: 15 }}>เพื่อนในกองทุน</span>} // Updated to span
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={student.knowThePimSmartFundFrom === "อื่นๆ"}
                onChange={() => setValue('knowThePimSmartFundFrom', 'อื่นๆ')}
                sx={{
                  transform: 'scale(0.8)', // Reduces the checkbox size
                  padding: '4px', // Reduces padding around the checkbox
                }}
              />
            }
            label={<span style={{ fontSize: 15 }}>อื่นๆ</span>} // Updated to span
          />
          {renderField('โปรดระบุ', student.additionalDetails, '50px')}

          </Box>



        </Grid>
      </Grid>
    </Box>
  );
};

export default PartOnePDF;
