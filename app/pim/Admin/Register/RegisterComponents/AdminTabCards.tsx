import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, Button, Dialog, DialogContent } from '@mui/material';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Student } from '@/types/Register';
import { FileWithMetadata } from '@/types/IResponse';
import { useStudentAdminApi } from '@/hooks/Admin/RegisterAdmin';
import TabCards from '@/components/TabCards';
import Addresses from '@/app/register/components/From/addresses';
import RegisterAdmin from '@/app/register/components/From/RegisterAdmin';
import Scholarships from '@/app/register/components/From/Scholarships';
import StepEight from '@/app/register/components/From/StepEight';
import StepElevenImg from '@/app/register/components/From/StepElevenImg';
import StepFive from '@/app/register/components/From/StepFive';
import StepNine from '@/app/register/components/From/StepNine';
import StepSeven from '@/app/register/components/From/StepSeven';
import StepSix from '@/app/register/components/From/StepSix';
import Studentpersonalinformation from '@/app/register/components/From/Studentpersonalinformation';
import StudentTenImg from '@/app/register/components/From/StudentTenImg';
import StudentTwelveImg from '@/app/register/components/From/StudentTwelveImg';

// Dynamically import FromAdminpdf
const FromAdminpdf = dynamic(() => import('@/app/register/components/From/FromAdminpdf'), { ssr: false });

interface RegisterFormProps {
  formMethods: UseFormReturn<Student>;
}

const badgeStyle = {
  backgroundColor: '#FF2828',
  color: '#FFFFFF',
  borderRadius: '50%',
  padding: '3px 6px',
  marginLeft: '8px',
  fontSize: '14px',
};

// Simplified function to render step labels
const StepLabelWithBadge = ({ stepIndex, errorCount }: { stepIndex: number, errorCount: number }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span>{`ขั้นตอนที่ ${stepIndex + 1}`}</span>
    {errorCount > 0 && (
      <span style={badgeStyle}>{errorCount}</span>
    )}
  </div>
);

const AdminTabCards: React.FC<RegisterFormProps> = ({ formMethods }) => {
  const { control, register, handleSubmit, formState: { errors }, setValue, getValues, watch } = formMethods;
  const [studentImages, setStudentImages] = useState<FileWithMetadata[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { loading, sendStudentData, uploadFiles } = useStudentAdminApi();
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [pdfData, setPdfData] = useState<Student | null>(null);
  const [stepErrorCounts, setStepErrorCounts] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Required fields for each step
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

  // Function to check missing fields and log them
  const checkFields = useCallback((fields: Array<keyof Student>, step: number) => {
    const missingFields = fields.filter(field => !getValues(field)); // Use getValues() to get the current value of the field
    setStepErrorCounts(prev => {
      const updatedCounts = [...prev];
      updatedCounts[step] = missingFields.length;
      return updatedCounts;
    });

    // Log missing fields only for the current step
    if (missingFields.length > 0) {
      console.log(`Step ${step + 1}: Missing Fields - ${missingFields.join(', ')}`);
    } else {
      console.log(`Step ${step + 1}: All fields are filled`);
    }
  }, [getValues]);

  // UseEffect to trigger validation when the current step changes or form data changes
  useEffect(() => {
    // Initial load: Check all fields
    console.log("Checking all fields on step change...");
    Object.keys(requiredFields).forEach((stepIndex) => {
      checkFields(requiredFields[+stepIndex as number], +stepIndex);
    });
  }, [getValues, requiredFields, checkFields, currentStep]); // run check on step change

  // Handle form submission
  const onSubmit = async (data: Student) => {
    // Check if there are missing fields across all steps before submitting
    let hasErrors = false;
    Object.keys(requiredFields).forEach((stepIndex) => {
      checkFields(requiredFields[+stepIndex as number], +stepIndex);
      // If any step has missing fields, set hasErrors to true
      if (stepErrorCounts[+stepIndex as number] > 0) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนที่จะส่งข้อมูล");
      return; // Do not proceed with submission if there are errors
    }

    setPdfData(data);
    setOpenPdfDialog(true);  // Open the PDF dialog after data is validated
  };

  const handleClosePdfDialog = () => setOpenPdfDialog(false);

  const handleImagesUpdate = (images: FileWithMetadata[], imageType: string) => {
    setStudentImages(prevState => [
      ...prevState.filter(img => img.imageType !== imageType),
      ...images.map(img => ({ ...img, imageType })),
    ]);
  };

  const handleStepChange = (newStep: number) => {
    setCurrentStep(newStep);
    // After step change, check all fields
    Object.keys(requiredFields).forEach((stepIndex) => {
      checkFields(requiredFields[+stepIndex as number], +stepIndex);
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, mx: "auto" }}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'กำลังส่ง...' : 'สง'}
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
        <Button type="button" onClick={() => currentStep > 0 && handleStepChange(currentStep - 1)} disabled={currentStep === 0}>ย้อนกลับ</Button>
        <Button type="button" onClick={() => currentStep < 11 && handleStepChange(currentStep + 1)} disabled={currentStep === 11}>ถัดไป</Button>
      </Box>
      <TabCards
        tabs={[
          ...[...Array(12)].map((_, index) => ({
            label: <StepLabelWithBadge stepIndex={index} errorCount={stepErrorCounts[index]} />,
            component: index === 0 ? <RegisterAdmin formMethods={formMethods} /> :
              index === 1 ? <Addresses formMethods={formMethods} /> :
              index === 2 ? <Scholarships formMethods={formMethods} /> :
              index === 3 ? <Studentpersonalinformation formMethods={formMethods} /> :
              index === 4 ? <StepFive formMethods={formMethods} /> :
              index === 5 ? <StepSix formMethods={formMethods} /> :
              index === 6 ? <StepSeven formMethods={formMethods} /> :
              index === 7 ? <StepEight formMethods={formMethods} /> :
              index === 8 ? <StepNine formMethods={formMethods} /> :
              index === 9 ? <StudentTenImg formMethods={formMethods} onImagesUpdate={(images) => handleImagesUpdate(images, 'studentPicture')} /> :
              index === 10 ? <StepElevenImg formMethods={formMethods} onImagesUpdate={(images) => handleImagesUpdate(images, 'uploadPictureHouse')} /> :
              <StudentTwelveImg formMethods={formMethods} onImagesUpdate={(images) => handleImagesUpdate(images, 'volunteerPictures')} />,
          }))
        ]}
        currentStep={currentStep}
        onTabChange={handleStepChange}
      />

      <Dialog open={openPdfDialog} onClose={handleClosePdfDialog} maxWidth={false}>
        <DialogContent>
          <FormProvider {...formMethods}>
            <FromAdminpdf formMethods={formMethods} studentImages={studentImages} setOpenPdfDialog={setOpenPdfDialog} />
          </FormProvider>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminTabCards;
