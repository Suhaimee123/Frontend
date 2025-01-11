import { Student, Location } from "@/types/Register";
import { Box, Grid, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import locationData from '@/components/ThaiPostcode/thailand-province-district-subdistrict-zipcode.json';


// Define the structure of the location data


interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const Scholarships: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = formMethods;

    const [provinces, setProvinces] = useState<string[]>([]);


    useEffect(() => {
        // Extract unique provinces from locationData
        const uniqueProvinces = Array.from(new Set(
            (locationData as unknown as Location[]).map(item => item.province)
        ));
        setProvinces(uniqueProvinces);
    }, []);





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
                        label="อาจารย์ที่ปรึกษา ชื่อ - นามสกุล *"
                        {...register("advisorNameSurname", { required: "กรุณากรอกชื่อและนามสกุลอาจารย์ที่ปรึกษา" })}
                        fullWidth
                        error={!!errors.advisorNameSurname}
                        helperText={errors.advisorNameSurname ? "This field is required" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="advisorPhoneNumber"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'กรุณากรอกเบอร์โทรอาจารย์ที่ปรึกษา',
                            pattern: {
                                value: /^\d{10}$/,
                                message: 'หมายเลขโทรศัพท์ต้องมี 10 หลัก',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="เบอร์โทรอาจารย์ที่ปรึกษา *"
                                {...field}
                                variant="outlined"
                                error={!!errors.advisorPhoneNumber}
                                helperText={errors.advisorPhoneNumber?.message}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\s+/g, '');
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required  error={!!errors.knowThePimSmartFundFrom}>
                        <InputLabel>รู้จักกองทุน PIM SMART จาก</InputLabel>
                        <Controller
                            name="knowThePimSmartFundFrom"
                            control={control}
                            rules={{ required: "กรุณาเลือกแหล่งที่มาของการรู้จักกองทุน" }}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    label="รู้จักกองทุน PIM SMART จาก"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                >
                                    <MenuItem value="คุณครูแนะแนวโรงเรียนมัธยม">คุณครูแนะแนวโรงเรียนมัธยม</MenuItem>
                                    <MenuItem value="ทีมแนะแนว">ทีมแนะแนว</MenuItem>
                                    <MenuItem value="ศิษย์เก่าที่โรงเรียน">ศิษย์เก่าที่โรงเรียน</MenuItem>
                                    <MenuItem value="LINE OA">LINE OA</MenuItem>
                                    <MenuItem value="FACEBOOK">FACEBOOK</MenuItem>
                                    <MenuItem value="อาจารย์ที่ปรึกษา">อาจารย์ที่ปรึกษา</MenuItem>
                                    <MenuItem value="เพื่อนในกองทุน PIM SMART">เพื่อนในกองทุน PIM SMART</MenuItem>
                                    <MenuItem value="อื่นๆ">อื่นๆ</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.knowThePimSmartFundFrom && <FormHelperText>{errors.knowThePimSmartFundFrom.message}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* Conditional TextField rendering */}
                {(watch('knowThePimSmartFundFrom') === 'อื่นๆ' ||
                    watch('knowThePimSmartFundFrom') === 'เพื่อนในกองทุน PIM SMART' ||
                    watch('knowThePimSmartFundFrom') === 'อาจารย์ที่ปรึกษา') && (
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="additionalDetails"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label={
                                            watch('knowThePimSmartFundFrom') === 'อื่นๆ'
                                                ? 'โปรดระบุรายละเอียดอื่นๆ'
                                                : watch('knowThePimSmartFundFrom') === 'เพื่อนในกองทุน PIM SMART'
                                                    ? 'โปรดระบุชื่อเพื่อน'
                                                    : 'โปรดระบุอาจารย์ที่ปรึกษา'
                                        }
                                        variant="outlined"
                                        {...field} // Ensures the field is correctly controlled
                                        error={!!errors.additionalDetails}
                                        helperText={errors.additionalDetails?.message}
                                    />
                                )}
                            />
                        </Grid>
                    )}






                <Grid item xs={12} md={6}>
                    <TextField
                        label="ทุนการศึกษาที่ได้รับ"
                        {...register("scholarshipReceived")}
                        fullWidth
                        error={!!errors.scholarshipReceived}
                        helperText={errors.scholarshipReceived ? "This field is required" : ""}
                    />
                </Grid>

                {/* Other Scholarships Field */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="ทุนการศึกษาอื่น ๆ"
                        {...register("otherScholarships")}
                        fullWidth
                        error={!!errors.otherScholarships}
                        helperText={errors.otherScholarships ? "This field is required" : ""}
                    />
                </Grid>

                {/* Education Loan Field */}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel>ทุนกู้ยืมเพื่อการศึกษา</InputLabel>
                        <Controller
                            name="educationLoan"
                            control={control}
                            defaultValue=""
                            rules={{ required: "กรุณาเลือกทุนกู้ยืมเพื่อการศึกษา" }}
                            render={({ field }) => (
                                <Select
                                    label="ทุนกู้ยืมเพื่อการศึกษา"
                                    {...field}
                                    error={!!errors.educationLoan}
                                >
                                    <MenuItem value="กยศ">กยศ</MenuItem>
                                    <MenuItem value="กรอ">กรอ</MenuItem>
                                    <MenuItem value="ไม่ได้กู้">ไม่ได้กู้</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="จบจากโรงเรียน *"
                        {...register('graduatedFromSchool', { required: "กรุณากรอกชื่อโรงเรียนที่จบ" })}
                        variant="outlined"
                        error={!!errors.graduatedFromSchool}
                        helperText={errors.graduatedFromSchool?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required error={!!errors.provinceSchool}>
                        <InputLabel>จังหวัด(โรงเรียน)</InputLabel>
                        <Controller
                            name="provinceSchool"
                            control={control}
                            defaultValue=""
                            rules={{ required: "กรุณาเลือกจังหวัดที่โรงเรียนตั้งอยู่" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="จังหวัด(โรงเรียน)"
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    {provinces.map((province) => (
                                        <MenuItem key={province} value={province}>
                                            {province}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>

            </Grid>

            {/* <Button type="submit" variant="contained" color="primary">
                Update
            </Button> */}
        </Box>
    );
};

export default Scholarships;
