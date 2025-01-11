import { Student } from "@/types/Register";
import { Box, Grid, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import locationData from '@/components/ThaiPostcode/thailand-province-district-subdistrict-zipcode.json';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import 'dayjs/locale/th';

// Define the structure of the location data


interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const Studentpersonalinformation: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = formMethods;




    const onSubmit = (data: Student) => {
        console.log("Form Data: ", data);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 800,
                mx: "auto",
                my: 4,
            }}
        >


            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Line ID"
                        {...register("lineId")}
                        fullWidth
                        error={!!errors.lineId}
                        helperText={errors.lineId ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Facebook"
                        {...register("facebook")}
                        fullWidth
                        error={!!errors.facebook}
                        helperText={errors.facebook ? "This field is required" : ""}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="บิดา ชื่อ - นามสกุล *"
                        {...register("fatherNameSurname", { required: "กรุณากรอกชื่อและนามสกุลบิดา" })}
                        fullWidth
                        error={!!errors.fatherNameSurname}
                        helperText={errors.fatherNameSurname ? "This field is required" : ""}
                    />
                </Grid>

                {/* Other Scholarships Field */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="มารดา ชื่อ - นามสกุล *"
                        {...register("motherNameSurname", { required: "กรุณากรอกชื่อและนามสกุลมารดา" })}
                        fullWidth
                        error={!!errors.motherNameSurname}
                        helperText={errors.motherNameSurname ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="อาชีพ(บิดา) *"
                        {...register("occupationFather", { required: "กรุณากรอกอาชีพบิดา" })}
                        fullWidth
                        error={!!errors.occupationFather}
                        helperText={errors.occupationFather ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="อาชีพ(มารดา) *"
                        {...register("occupationMother", { required: "กรุณากรอกอาชีพมารดา" })}
                        fullWidth
                        error={!!errors.occupationMother}
                        helperText={errors.occupationMother ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="ประมาณรายได้ของบิดาต่อเดือน *"
                        {...register("estimateFatherMonthlyIncome", { required: "กรุณากรอกรายได้บิดา" })}
                        fullWidth
                        error={!!errors.estimateFatherMonthlyIncome}
                        helperText={errors.estimateFatherMonthlyIncome ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="ประมาณรายได้ของมารดาต่อเดือน *"
                        {...register("motherApproximateMonthlyIncome", { required: "กรุณากรอกรายได้มารดา" })}
                        fullWidth
                        error={!!errors.motherApproximateMonthlyIncome}
                        helperText={errors.motherApproximateMonthlyIncome ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel>ที่อยู่บิดา</InputLabel>
                        <Controller
                            name="fatherAddress"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'กรุณาเลือกที่ที่อยู่บิดา' }}
                            render={({ field }) => (
                                <Select
                                    label="ที่อยู่บิดา"
                                    {...field}
                                    error={!!errors.fatherAddress}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(e);
                                        if (value !== 'ที่อยู่อื่น') {
                                            setValue('fatherAddressDetails', '');  // Clear the fatherAddressDetails field
                                        }
                                    }}
                                >
                                    <MenuItem value="ที่อยุ่เดียวกับนักศึกษา">ที่อยุ่เดียวกับนักศึกษา</MenuItem>
                                    <MenuItem value="ที่อยู่อื่น">ที่อยู่อื่น</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>

                {watch('fatherAddress') === 'ที่อยู่อื่น' && (
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="fatherAddressDetails"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="ที่อยู่อื่นโปรดระบุ (บิดา)"
                                    {...field}
                                    variant="outlined"
                                    error={!!errors.fatherAddressDetails}
                                    helperText={errors.fatherAddressDetails?.message}
                                />
                            )}
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel>ที่อยู่มารดา</InputLabel>
                        <Controller
                            name="motherAddress"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'กรุณาเลือกที่ที่อยู่มารดา' }}
                            render={({ field }) => (
                                <Select
                                    label="ที่อยู่มารดา"
                                    {...field}
                                    error={!!errors.motherAddress}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(e);
                                        if (value !== 'ที่อยู่อื่น') {
                                            setValue('motherAddressDetails', '');  // Clear the fatherAddressDetails field
                                        }
                                    }}
                                >
                                    <MenuItem value="ที่อยุ่เดียวกับนักศึกษา">ที่อยุ่เดียวกับนักศึกษา</MenuItem>
                                    <MenuItem value="ที่อยู่อื่น">ที่อยู่อื่น</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>

                {watch('motherAddress') === 'ที่อยู่อื่น' && (
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="motherAddressDetails"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="ที่อยู่อื่นโปรดระบุ (มารดา)"
                                    {...field}
                                    variant="outlined"
                                    error={!!errors.motherAddressDetails}
                                    helperText={errors.motherAddressDetails?.message}
                                />
                            )}
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="โรคประจำตัวของท่าน (ถ้ามี)"
                        {...register("congenitalDisease")}
                        fullWidth
                        error={!!errors.congenitalDisease}
                        helperText={errors.congenitalDisease ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="โรคจำตัวบิดา (ถ้ามี)"
                        {...register("paternalMemoryDisorder")}
                        fullWidth
                        error={!!errors.paternalMemoryDisorder}
                        helperText={errors.paternalMemoryDisorder ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="โรคจำตัวมารดา (ถ้ามี)"
                        {...register("maternalMemoryDisorder")}
                        fullWidth
                        error={!!errors.maternalMemoryDisorder}
                        helperText={errors.maternalMemoryDisorder ? "This field is required" : ""}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel>สถานภาพบิดา</InputLabel>
                        <Controller
                            name="fatherStatus"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'กรุณาเลือกสถานภาพบิดา' }}
                            render={({ field }) => (
                                <Select
                                    label="สถานภาพบิดา"
                                    {...field}
                                    error={!!errors.fatherStatus}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(e);
                                        if (value !== 'เสียชีวิต') {
                                            setValue('fatherStatusDetails', '');
                                        }
                                    }}
                                >
                                    <MenuItem value="มีชีวิตอยู่">มีชีวิตอยู่</MenuItem>
                                    <MenuItem value="เสียชีวิต">เสียชีวิต</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>

                {watch('fatherStatus') === 'เสียชีวิต' && (
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th"> {/* Set Thai locale */}
                            <Controller
                                name="fatherStatusDetails"
                                control={control}
                                defaultValue={dayjs().locale("th").format("DD/MM/YYYY")} // Default value in Thai format
                                rules={{ required: "กรุณาระบุวันเดือนปี (บิดา)" }}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="โปรดระบุวันเดือนปี (บิดา)"
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
                                        onChange={(date) => field.onChange(date?.locale("th").format("DD/MM/YYYY"))} // Format date in Thai
                                        value={field.value ? dayjs(field.value, "DD/MM/YYYY").locale("th") : null} // Parse with Thai locale
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>



                )}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel>สถานภาพมารดา</InputLabel>
                        <Controller
                            name="maternalStatus"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'กรุณาเลือกที่สถานภาพมารดา' }}
                            render={({ field }) => (
                                <Select
                                    label="สถานภาพมารดา"
                                    {...field}
                                    error={!!errors.maternalStatus}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(e);
                                        if (value !== 'เสียชีวิต') {
                                            setValue('maternalStatusDetails', '');
                                        }
                                    }}
                                >
                                    <MenuItem value="มีชีวิตอยู่">มีชีวิตอยู่</MenuItem>
                                    <MenuItem value="เสียชีวิต">เสียชีวิต</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>

                {watch('maternalStatus') === 'เสียชีวิต' && (
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th"> {/* Set Thai locale */}
                            <Controller
                                name="maternalStatusDetails"
                                control={control}
                                defaultValue=""
                                rules={{ required: "กรุณาระบุวันเดือนปี (มารดา)" }}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="โปรดระบุวันเดือนปี (มารดา)"
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
                                        onChange={(date) => field.onChange(date?.locale("th").format("DD/MM/YYYY"))} // Format date in Thai
                                        value={field.value ? dayjs(field.value, "DD/MM/YYYY").locale("th") : null} // Parse with Thai locale
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="มีพี่น้อง ( รวมนักศึกษา ) *"
                        {...register("haveSiblings", { required: "กรุณากรอกจำนวนพี่น้อง" })}
                        fullWidth
                        error={!!errors.haveSiblings}
                        helperText={errors.haveSiblings ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="เป็นหญิง *"
                        {...register("woman", { required: "กรุณากรอกข้อมูลเพศหญิง" })}
                        fullWidth
                        error={!!errors.woman}
                        helperText={errors.woman ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="เป็นชาย *"
                        {...register("man", { required: "กรุณากรอกข้อมูลเพศชาย" })}
                        fullWidth
                        error={!!errors.man}
                        helperText={errors.man ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="นักศึกษาเป็นลูกคนที่ (ของจำนวนพี่น้อง) *"
                        {...register("personWho", { required: "กรุณากรอกลำดับของนักศึกษา" })}
                        fullWidth
                        error={!!errors.personWho}
                        helperText={errors.personWho ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="กรณีไม่ได้อยู่กับพ่อแม่กรอกข้อมูลผู้ปกครอง"
                        {...register("parentInformation")}
                        fullWidth
                        error={!!errors.parentInformation}
                        helperText={errors.parentInformation ? "This field is required" : ""}
                    />
                </Grid>



            </Grid>

            {/* <Button type="submit" variant="contained" color="primary">
                Update
            </Button> */}
        </Box>
    );
};

export default Studentpersonalinformation;
