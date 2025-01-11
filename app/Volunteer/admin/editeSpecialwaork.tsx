

"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import { TextField, Button, Typography, Box, Grid, MenuItem, FormHelperText, CircularProgress } from '@mui/material';
import { FileWithMetadata, FormValuesWork } from '@/types/IResponse';
import CustomFileUpload from '@/components/CustomFileUpload';

import { submitSpecialWorkForm } from '@/app/api/SpecialWork';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import AlertBox from '@/components/Alert/Alert';

import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useuploadSpecialWorkApi } from '@/hooks/SpecialWork';
import { useSpecialWorkImages } from '@/hooks/Admin/specialworkImage';
import { base64ToFile } from '@/components/base64ToFile';
import { useDeleteSpecialWorkImage } from '@/hooks/Admin/useDeketeSpecial';

interface WorkFormProps {
  formwork: UseFormReturn<FormValuesWork>;
}

const SpecialWorkForm: React.FC<WorkFormProps> = ({ formwork }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = formwork;

  const uploadPictureHouse = watch("uploadSpecialwork");
  const [files, setFiles] = useState<File[]>([]);
  const [sendFiles, setSendFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const { loading, error, response, uploadSpecialWork } = useuploadSpecialWorkApi();
  const specialworkId = watch("id");
  const imageType = "Specialwork";

  const { loading: loadingImages, images, error: fetchImagesError, fetchSpecialWorkImages } = useSpecialWorkImages();
  const { fetchDeleteSpecialwork, isLoading: deletingImageLoading, error: deleteImageError, successMessage } = useDeleteSpecialWorkImage();
  const [isFetching, setIsFetching] = useState(false);

  const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const fetchWorkImages = async () => {
    // ตรวจสอบว่า specialworkId มีและไม่มีไฟล์ใน `uploadPictureHouse` แล้วจึงทำการโหลดข้อมูล
    if (specialworkId && !files.length && !isFetching && (!uploadPictureHouse || uploadPictureHouse.length === 0)) {
      setIsFetching(true);
      try {
        const result = await fetchSpecialWorkImages(specialworkId, imageType);
        console.log("Fetched Specialwork images:", result);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsFetching(false);
      }
    } else if (uploadPictureHouse && uploadPictureHouse.length > 0) {
      console.log("มีข้อมูลใน Specialwork แล้ว ไม่ต้องโหลดซ้ำ");
    }
  };

  useEffect(() => {
    fetchWorkImages();
  }, [specialworkId, uploadPictureHouse]);

  // การแปลงและจัดเก็บภาพ
  useEffect(() => {
    if (images && images.length > 0) {
      const imageFilesWithMetadata = images.map((imageObj) => {
        const file = base64ToFile(imageObj.image, imageObj.name);
        return { name: imageObj.name, file, imageData: imageObj.imageData, imageType: "Specialwork" };
      });

      // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่ก่อนจะอัปเดต

      if (JSON.stringify(imageFilesWithMetadata) !== JSON.stringify(filesWithMetadata)) {
        setFilesWithMetadata(imageFilesWithMetadata);
        setValue("uploadSpecialwork", imageFilesWithMetadata.map(item => item.file), { shouldValidate: true });
        console.log("imageSpecialworkPictures ", images);
      }
    }
  }, [images, setValue, filesWithMetadata]);





  // การตั้งค่าไฟล์ในกรณีที่ uploadPictureHouse เป็น FileList หรือ Array
  useEffect(() => {
    if (uploadPictureHouse instanceof FileList) {
      setFiles(Array.from(uploadPictureHouse));
    } else if (Array.isArray(uploadPictureHouse)) {
      setFiles(uploadPictureHouse);
    }
  }, [uploadPictureHouse]);




  const handleFileChange = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles];
    const newFiles2 = [...newFiles];
    console.log('updatedFiles', updatedFiles);

    setSendFiles(newFiles2);
    setFiles(updatedFiles);
    console.log("files2: ", files);
    setValue("uploadSpecialwork", updatedFiles, { shouldValidate: true });
  };



  const handleFileRemove = async (fileToRemove: File) => {
    // Find the file in the list that matches the fileToRemove
    const matchedFile = filesWithMetadata.find(item => item.file.name === fileToRemove.name);

    if (matchedFile) {
      console.log("Removing file with matching imageData:", matchedFile.imageData);

      // Call the fetchDeleteStudent function and await its result
      const response = await fetchDeleteSpecialwork(matchedFile.imageData);

      // Optionally handle the response after deletion
      if (response.success) {
        console.log("File deleted successfully:", matchedFile.file.name);
      } else {
        console.error("Failed to delete file:", response.error);
      }
    } else {
      console.log("No matching imageData found for file:", fileToRemove.name);
    }

    // Update the local file state after the deletion attempt
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    setValue("uploadSpecialwork", updatedFiles, { shouldValidate: true });
  };





  const onSubmit = useCallback(async (data: FormValuesWork) => {
    console.log("edit ข้อมูลที่ส่งในฟอร์ม: ", data);

    // ตรวจสอบว่าไฟล์ถูกอัปโหลดหรือไม่
    if (!data.uploadSpecialwork || data.uploadSpecialwork.length === 0) {
      setFileError("โปรดตรวจสอบให้แน่ใจว่าได้อัปโหลดไฟล์ที่จำเป็นทั้งหมดแล้ว");
      setAlertText("เกิดข้อผิดพลาด");
      setAlertDesc("กรุณาอัปโหลดไฟล์ก่อนส่งฟอร์ม");
      setAlertType("error");
      setIsAlertOpen(true); // แสดง alert
      return;
    }

    const { studentId, firstName } = data;

    // ตรวจสอบรหัสนักศึกษาและชื่อ
    if (!studentId || !firstName) {
      setFileError("ไม่พบข้อมูลรหัสนักศึกษาหรือชื่อเต็ม");
      setAlertText("ข้อมูลไม่ครบถ้วน");
      setAlertDesc("กรุณากรอกข้อมูลรหัสนักศึกษาหรือชื่อเต็ม");
      setAlertType("warning");
      setIsAlertOpen(true); // แสดง alert
      return;
    }

    const imageType: "Specialwork" = "Specialwork";

    // ส่งฟอร์ม
    const sendResult = await submitSpecialWorkForm(data);
    if (!sendResult) {
      setFileError("การส่งข้อมูลกิจกรรมงานพิเศษล้มเหลว");
      setAlertText("เกิดข้อผิดพลาดในการส่งข้อมูล");
      setAlertDesc("ไม่สามารถส่งข้อมูลกิจกรรมงานพิเศษได้");
      setAlertType("error");
      setIsAlertOpen(true); // แสดง alert
      return;
    }

    const id = sendResult.data?.id;
    console.log("ID ของกิจกรรมที่สร้างขึ้น: ", id);

    console.log("files: ", files);
    console.log("sendFiles: ", sendFiles);
    console.log("studentId: ", studentId);
    console.log("firstName: ", firstName);
    console.log("imageType: ", imageType);

    // ตรวจสอบและอัปโหลดไฟล์
    if (sendFiles.length > 0) {
      await uploadSpecialWork(sendFiles, studentId, firstName, imageType, id);
      reset(); // ใช้ฟังก์ชัน reset เพื่อรีเซ็ตฟอร์ม
      setFiles([]); // ล้างข้อมูลไฟล์
      setFileError(null); // รีเซ็ตข้อความ error

      // แสดง alert
    }
    setAlertText("การส่งข้อมูลสำเร็จ");
    setAlertDesc("ข้อมูลกิจกรรมงานพิเศษของคุณได้รับการบันทึกแล้ว");
    setAlertType("success");
    setIsAlertOpen(true);
    window.location.reload();
  }, [submitSpecialWorkForm, uploadSpecialWork]); // ใช้ dependencies เหมือน `volunteer`

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, mx: 'auto', my: 4 }}
      >
        <Typography color="secondary" align="center" sx={{ mt: 2 }}>
          ส่งข้อมูลกิจกรรมงานพิเศษ
        </Typography>

        <Grid container spacing={2}>
          {/* ฟิลด์รหัสนักศึกษา */}
          <Grid item xs={12} md={6}>
            <Controller
              name="studentId"
              control={control}
              defaultValue=""
              rules={{
                required: "รหัสนักศึกษาจำเป็นต้องกรอก",
                pattern: {
                  value: /^[0-9]+$/, // อนุญาตเฉพาะตัวเลขเท่านั้น
                  message: "กรุณากรอกเฉพาะตัวเลข",
                },
                maxLength: {
                  value: 10,
                  message: "กรุณากรอกไม่เกิน 10 หลัก",
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="รหัสนักศึกษา"
                  {...field}
                  variant="outlined"
                  error={!!errors.studentId}
                  helperText={errors.studentId?.message}
                  inputProps={{
                    inputMode: "numeric", // เปิดคีย์บอร์ดตัวเลขในมือถือ
                    maxLength: 10, // จำกัดจำนวนตัวเลข
                  }}
                  onKeyDown={(e) => {
                    // อนุญาตเฉพาะตัวเลข, Backspace, Delete, Arrow Keys
                    if (
                      !(
                        (e.key >= "0" && e.key <= "9") || // ตัวเลข
                        e.key === "Backspace" || // ลบ
                        e.key === "Delete" || // ลบ
                        e.key === "ArrowLeft" || // ลูกศรซ้าย
                        e.key === "ArrowRight" // ลูกศรขวา
                      )
                    ) {
                      e.preventDefault(); // ป้องกันการพิมพ์ตัวอักษร
                    }
                  }}
                  onPaste={(e) => {
                    // ดักไม่ให้วางข้อมูลที่มีตัวอักษร
                    const pastedData = e.clipboardData.getData("text");
                    if (!/^\d+$/.test(pastedData)) {
                      e.preventDefault(); // ป้องกันข้อมูลที่ไม่ใช่ตัวเลข
                    }
                  }}
                  onChange={(e) => {
                    // ลบข้อมูลที่ไม่ใช่ตัวเลขในขณะพิมพ์
                    const sanitizedValue = e.target.value.replace(/\D/g, ""); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
                    field.onChange(sanitizedValue); // อัปเดตค่าใน React Hook Form
                  }}
                />
              )}
            />
          </Grid>


          {/* ฟิลด์คำนำหน้า */}
          <Grid item xs={12} md={6}>
            <Controller
              name="prefix"
              control={control}
              defaultValue=""
              rules={{ required: 'โปรดเลือกคำนำหน้า' }}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="คำนำหน้า"
                  {...field}
                  variant="outlined"
                  error={!!errors.prefix}
                  helperText={errors.prefix?.message}
                >
                  <MenuItem value="male">ชาย</MenuItem>
                  <MenuItem value="female">หญิง</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* ฟิลด์ชื่อเต็ม */}
          <Grid item xs={12} md={6}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: 'จำเป็นต้องกรอกชื่อเต็ม' }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="ชื่อ - นามสกุล"
                  {...field}
                  variant="outlined"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>

          {/* ฟิลด์ชื่อเล่น */}
          <Grid item xs={12} md={6}>
            <Controller
              name="nickname"
              control={control}
              defaultValue=""
              rules={{ required: 'จำเป็นต้องกรอกชื่อเล่น' }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="ชื่อเล่น"
                  {...field}
                  variant="outlined"
                  error={!!errors.nickname}
                  helperText={errors.nickname?.message}
                />
              )}
            />
          </Grid>

          {/* ฟิลด์ชั้นปีที่จบ */}
          <Grid item xs={12} md={6}>
            <Controller
              name="graduate"
              control={control}
              defaultValue=""
              rules={{ required: 'โปรดเลือกชั้นปีที่จบ' }}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="ชั้นปี"
                  {...field}
                  variant="outlined"
                  error={!!errors.graduate}
                  helperText={errors.graduate?.message}
                >
                  <MenuItem value="ชั้นปีที่ 1">ชั้นปีที่ 1</MenuItem>
                  <MenuItem value="ชั้นปีที่ 2">ชั้นปีที่ 2</MenuItem>
                  <MenuItem value="ชั้นปีที่ 3">ชั้นปีที่ 3</MenuItem>
                  <MenuItem value="ชั้นปีที่ 4">ชั้นปีที่ 4</MenuItem>
                  <MenuItem value="ชั้นปีที่ 5">ชั้นปีที่ 5</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* ฟิลด์สาขา */}
          <Grid item xs={12} md={6}>
            <Controller
              name="branch"
              control={control}
              defaultValue=""
              rules={{ required: 'โปรดเลือกสาขา' }}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="สาขา"
                  {...field}
                  variant="outlined"
                  error={!!errors.branch}
                  helperText={errors.branch?.message}
                >
                  <MenuItem value="MTM">MTM</MenuItem>
                  <MenuItem value="IMTM">IMTM</MenuItem>
                  <MenuItem value="FBM">FBM</MenuItem>
                  <MenuItem value="RBM">RBM</MenuItem>
                  <MenuItem value="LTM">LTM</MenuItem>
                  <MenuItem value="BC">BC</MenuItem>
                  <MenuItem value="BJ">BJ</MenuItem>
                  <MenuItem value="CEB">CEB</MenuItem>
                  <MenuItem value="CB">CB</MenuItem>
                  <MenuItem value="CJ">CJ</MenuItem>
                  <MenuItem value="DIT">DIT</MenuItem>
                  <MenuItem value="CAI">CAI</MenuItem>
                  <MenuItem value="IE">IE</MenuItem>
                  <MenuItem value="AME">AME</MenuItem>
                  <MenuItem value="RAE">RAE</MenuItem>
                  <MenuItem value="IAM">IAM</MenuItem>
                  <MenuItem value="AVI">AVI</MenuItem>
                  <MenuItem value="HTM">HTM</MenuItem>
                  <MenuItem value="RPM">RPM</MenuItem>
                  <MenuItem value="HROM">HROM</MenuItem>
                  <MenuItem value="FTM">FTM</MenuItem>
                  <MenuItem value="PTM">PTM</MenuItem>
                  <MenuItem value="TCL">TCL</MenuItem>
                  <MenuItem value="ELT">ELT</MenuItem>
                  <MenuItem value="NS">NS</MenuItem>
                  <MenuItem value="NS">HIT</MenuItem>
                  {/* เพิ่มสาขาเพิ่มเติม */}
                </TextField>
              )}
            />
          </Grid>

          {/* ฟิลด์ชื่อกิจกรรม */}
          <Grid item xs={12} md={6}>
            <Controller
              name="workName"
              control={control}
              defaultValue=""
              rules={{ required: 'จำเป็นต้องกรอกชื่อกิจกรรม' }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="ตำแหน่งงาน"
                  {...field}
                  variant="outlined"
                  error={!!errors.workName}
                  helperText={errors.workName?.message}
                />
              )}
            />
          </Grid>

          {/* ฟิลด์ชื่อองค์กร */}
          <Grid item xs={12} md={6}>
            <Controller
              name="organizationName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="ชื่อองค์กร"
                  {...field}
                  variant="outlined"
                  error={!!errors.organizationName}
                  helperText={errors.organizationName?.message}
                />
              )}
            />
          </Grid>

          {/* ฟิลด์เบอร์โทรศัพท์องค์กร */}
          <Grid item xs={12} md={6}>
            <Controller
              name="organizationPhone"
              control={control}
              defaultValue=""
              rules={{
                required: "กรุณากรอกเบอร์โทรศัพท์",
                pattern: {
                  value: /^[0-9]+$/, // อนุญาตเฉพาะตัวเลขเท่านั้น
                  message: "กรุณากรอกเฉพาะตัวเลข",
                },
                maxLength: {
                  value: 10,
                  message: "กรุณากรอกไม่เกิน 10 หลัก",
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์องค์กร"
                  {...field}
                  variant="outlined"
                  error={!!errors.organizationPhone}
                  helperText={errors.organizationPhone?.message}
                  inputProps={{
                    inputMode: "numeric", // เปิดคีย์บอร์ดตัวเลขในมือถือ
                    maxLength: 10, // จำกัดจำนวนตัวเลข
                  }}
                  onKeyDown={(e) => {
                    // อนุญาตเฉพาะตัวเลข, Backspace, Delete, Arrow Keys
                    if (
                      !(
                        (e.key >= "0" && e.key <= "9") || // ตัวเลข
                        e.key === "Backspace" || // ลบ
                        e.key === "Delete" || // ลบ
                        e.key === "ArrowLeft" || // ลูกศรซ้าย
                        e.key === "ArrowRight" // ลูกศรขวา
                      )
                    ) {
                      e.preventDefault(); // ป้องกันการพิมพ์ตัวอักษร
                    }
                  }}
                  onPaste={(e) => {
                    // ดักไม่ให้วางข้อมูลที่มีตัวอักษร
                    const pastedData = e.clipboardData.getData("text");
                    if (!/^\d+$/.test(pastedData)) {
                      e.preventDefault(); // ป้องกันการวางข้อมูลที่ไม่ใช่ตัวเลข
                    }
                  }}
                  onChange={(e) => {
                    // ลบข้อมูลที่ไม่ใช่ตัวเลขขณะพิมพ์
                    const sanitizedValue = e.target.value.replace(/\D/g, ""); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
                    field.onChange(sanitizedValue); // อัปเดตค่าใน React Hook Form
                  }}
                />
              )}
            />
          </Grid>


          {/* ฟิลด์รายละเอียดกิจกรรม */}
          <Grid item xs={12}>
            <Controller
              name="workDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="รายละเอียดกิจกรรม"
                  {...field}
                  variant="outlined"
                  error={!!errors.workDescription}
                  helperText={errors.workDescription?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="activityDate"
                control={control}
                defaultValue={dayjs().locale("th").format("DD/MM/YYYY")}
                rules={{ required: "จำเป็นต้องวันที่ทำกิจกรรม" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="วันที่ทำกิจกรรม"
                    {...field}
                    views={['year', 'month', 'day']} // Day, Month, Year views
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                    onChange={(date) => field.onChange(date?.locale("th").format("DD/MM/YYYY"))}
                    value={field.value ? dayjs(field.value, "DD/MM/YYYY").locale("th") : null} // Parse with Thai locale
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>



          {/* ฟิลด์จำนวนชั่วโมง */}
          <Grid item xs={12} md={6}>
            <Controller
              name="hours"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="จำนวนชั่วโมง"
                  type="number"
                  {...field}
                  variant="outlined"
                />
              )}
            />
          </Grid>

          {/* ฟิลด์ประเภทงาน */}
          <Grid item xs={12} md={6}>
            <Controller
              name="workType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="ประเภทงาน"
                  {...field}
                  variant="outlined"
                >
                  <MenuItem value="Full-Time">งานเต็มเวลา</MenuItem>
                  <MenuItem value="Part-Time">งานพาร์ทไทม์</MenuItem>
                  <MenuItem value="Internship">ฝึกงาน</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* ฟิลด์ค่าตอบแทน */}
          <Grid item xs={12} md={6}>
            <Controller
              name="compensation"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="ค่าตอบแทน"
                  type="number"
                  {...field}
                  variant="outlined"
                />
              )}
            />
          </Grid>

          {/* ฟิลด์อัปโหลดรูปภาพกิจกรรม */}
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              *อัพโหลดรูปภาพกิจกรรมที่ทำ ให้เห็นหน้า
            </Typography>
            <CustomFileUpload
              value={files}
              multiple
              onChange={handleFileChange}
              onRemove={handleFileRemove}
              accept="image/*"
            />
            {fileError && (
              <FormHelperText error>{fileError}</FormHelperText>
            )}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" color="primary" align="center">
              รูปภาพที่อัพโหลด
            </Typography>
            {loadingImages ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {files.length > 0 ? (
                  files.map((file, index) => (
                    <Grid item xs={4} key={index}>
                      <Box
                        component="img"
                        src={URL.createObjectURL(file)} // Use the local URL for the file
                        alt={file.name}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 1,
                          boxShadow: 1,
                        }}
                      />
                      {/* <Typography variant="caption" align="center">{file.name}</Typography> */}
                    </Grid>
                  ))
                ) : (
                  <Typography align="center">No images available</Typography>
                )}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* ปุ่มส่งข้อมูล */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          ส่งข้อมูล
        </Button>
      </Box>

      <AlertBox
        text={alertText}
        desc={alertDesc}
        type={alertType}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        timeoutDuration={2000}
      />
    </>
  );
};

export default SpecialWorkForm;
