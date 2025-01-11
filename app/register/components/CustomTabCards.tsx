import React, { useState, useEffect, useMemo } from 'react';
import TabCards from '@/components/TabCards';
import { Student } from '@/types/Register';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Box, Button, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { useStudentApi } from '@/hooks/RegisterH';
import dynamic from 'next/dynamic';
import RegisterForm from './From/RegisterForm';
import Addresses from './From/addresses';
import Scholarships from './From/Scholarships';
import StepFive from './From/StepFive';
import StepSix from './From/StepSix';
import StepSeven from './From/StepSeven';
import StepEight from './From/StepEight';
import StepNine from './From/StepNine';
import StepTen from './From/StepTen';
import StepEleven from './From/StepEleven';
import StepTwelve from './From/StepTwelve';
import Studentpersonalinformation from './From/Studentpersonalinformation';

// Dynamically load PDF viewer
const FromUserpdf = dynamic(() => import('./From/FromUserpdf'), { ssr: false });

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}

const badgeStyle = {
  backgroundColor: '#FF2828', // สีพื้นหลังแดง
  color: '#FFFFFF', // สีข้อความขาว
  borderRadius: '50%', // ทำให้เป็นทรงกลม
  padding: '3px 6px', // ขนาด padding
  marginLeft: '8px', // ช่องห่างระหว่าง Step 2 กับ badge
  fontSize: '14px', // ขนาดฟอนต์
};

const StepLabelWithBadge = ({ stepIndex, errorCount }: { stepIndex: number, errorCount: number }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span>{`ขั้นตอนที่ ${stepIndex + 1}`}</span>
    {errorCount > 0 && (
      <span style={badgeStyle}>{errorCount}</span>
    )}
  </div>
);

const CustomTabCards: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [stepErrorCounts, setStepErrorCounts] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { handleSubmit, watch, getValues } = formMethods;
  const { loading } = useStudentApi();

  const formValues = watch(); // watch all form values

  // Fields that need to be validated for Step 1 and Step 2
  const requiredFields: Record<number, Array<keyof Student>> = useMemo(() => ({
    0: ['studentId', 'firstName', 'prefix', 'thaiName', 'lastName', 'nickname', 'dateOfBirth', 'nationalId', 'email', 'phoneNumber', 'faculty', 'gender', 'fieldOfStudy', 'placeOfStudy', 'currentlyStudyingYear', 'studentType', 'block', 'currentGpa'],
    1: ['currentAddress', 'studentResident', 'numberOfResidents', 'addressAccordingToHouseRegistration', 'postalCode', 'province', 'district', 'subdistrict'],
    2: ['advisorNameSurname', 'advisorPhoneNumber', 'knowThePimSmartFundFrom', 'educationLoan', 'graduatedFromSchool', 'provinceSchool'],
    3: ['fatherNameSurname', 'motherNameSurname', 'occupationFather', 'occupationMother', 'estimateFatherMonthlyIncome', 'motherApproximateMonthlyIncome', 'fatherAddress', 'motherAddress', 'fatherStatus', 'maternalStatus', 'haveSiblings', 'woman', 'man', 'personWho'],
    4: ['addressValue', 'roundTripTravel', 'householdExpenses', 'familyDebt'],
    5: ['contactInformation', 'emergencyContact', 'relationship', 'emergencyContactPhoneNumber'],
    6: ['beautyEnhancement'],
    9: ['studentPicture'],
    10: ['uploadPictureHouse'],
    11: ['volunteerPictures'],
  }), []);
  // Helper function to check for missing fields
  const checkFields = (fields: Array<keyof Student>, step: number) => {
    const missingFields = fields.filter(field => !formValues[field]); // Check using formValues from watch
    setStepErrorCounts(prev => {
      const updatedCounts = [...prev];
      updatedCounts[step] = missingFields.length;
      return updatedCounts;
    });
  };

  // ใช้ watch เพื่อตรวจสอบทุกครั้งที่มีการกรอกข้อมูล
  useEffect(() => {
    Object.keys(requiredFields).forEach((stepIndex) => {
      checkFields(requiredFields[+stepIndex as number], +stepIndex);
    });
  }, [formValues]);

  const onSubmit = async (data: Student) => {
    if (stepErrorCounts.some(count => count > 0)) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนที่จะสงข้อมูล");
      return;
    }
    setOpenPdfDialog(true);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, mx: "auto", px: { xs: 2, sm: 4 } }}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'กำลังส่ง...' : 'ส่ง'}
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
        <Button type="button" onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)} disabled={currentStep === 0}>ย้อนกลับ</Button>
        <Button type="button" onClick={() => currentStep < 11 && setCurrentStep(prev => prev + 1)} disabled={currentStep === 11}>ถัดไป</Button>  
      </Box>

      <Box display="flex" flexDirection="column" justifyContent="center" sx={{ mt: 2, overflowX: { xs: "scroll", sm: "hidden" } }}>
        <TabCards
        tabs={[
          ...[...Array(12)].map((_, index) => ({
            label: <StepLabelWithBadge stepIndex={index} errorCount={stepErrorCounts[index]} />,
            component: index === 0 ? <RegisterForm formMethods={formMethods} /> :
              index === 1 ? <Addresses formMethods={formMethods} /> :
              index === 2 ? <Scholarships formMethods={formMethods} /> :
              index === 3 ? <Studentpersonalinformation formMethods={formMethods} /> :
              index === 4 ? <StepFive formMethods={formMethods} /> :
              index === 5 ? <StepSix formMethods={formMethods} /> :
              index === 6 ? <StepSeven formMethods={formMethods} /> :
              index === 7 ? <StepEight formMethods={formMethods} /> :
              index === 8 ? <StepNine formMethods={formMethods} /> :
              index === 9 ? <StepTen formMethods={formMethods} /> :
              index === 10 ? <StepEleven formMethods={formMethods} /> :
              <StepTwelve formMethods={formMethods}  />,
          }))
        ]}
          currentStep={currentStep}
          onTabChange={setCurrentStep}
        />
      </Box>

      <Dialog open={openPdfDialog} onClose={() => setOpenPdfDialog(false)} maxWidth="lg" PaperProps={{ style: { width: isMobile ? '100%' : '210mm', height: isMobile ? '100%' : '297mm', margin: 'auto', padding: isMobile ? '10px' : '0' } }}>
        <DialogTitle>PDF</DialogTitle>
        <DialogContent sx={{ overflow: "auto", maxHeight: "80vh" }}>
          <FormProvider {...formMethods}>
            <FromUserpdf formMethods={formMethods} />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomTabCards;
