import { Student } from "@/types/Register";
import { Box, Grid, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import locationData from '@/components/ThaiPostcode/thailand-province-district-subdistrict-zipcode.json';


// Define the structure of the location data


interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const StepSeven: React.FC<RegisterFormProps> = ({ formMethods }) => {
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
            {/* <Typography color="secondary" align="center" sx={{ mt: 2 }}>
                ข้อมูลของท่านยังไม่มีในระบบ
            </Typography> */}
            <Grid container spacing={2}>


                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined"  required  error={!!errors.beautyEnhancement}>
                        <InputLabel>นักศึกษาได้ทำการเสริมความงามระหว่างการศึกษาได้หรือไม่?</InputLabel>
                        <Controller
                            name="beautyEnhancement"
                            control={control}
                            defaultValue=""
                            rules={{ required: "กรุณาเลือกนักศึกษาได้ทำการเสริมความงามหรือไม่" }}
                            render={({ field }) => (
                                <Select
                                    label="นักศึกษาได้ทำการเสริมความงามระหว่างการศึกษาได้หรือไม่?"
                                    {...field}
                                    error={!!errors.beautyEnhancement}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(e);
                                        if (value !== 'ทำเสริมความงาม') {
                                            setValue('beautyEnhancementDetails', '');
                                        }
                                    }}
                                >
                                    <MenuItem value="ทำเสริมความงาม">ทำเสริมความงาม</MenuItem>
                                    <MenuItem value="ไม่">ไม่</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>
                {watch('beautyEnhancement') === 'ทำเสริมความงาม' && (
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="beautyEnhancementDetails"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="โปรดระบุเหตุผล"
                                    {...field}
                                    variant="outlined"
                                    error={!!errors.beautyEnhancementDetails}
                                    helperText={errors.beautyEnhancementDetails?.message}
                                />
                            )}
                        />
                    </Grid>
                )}


                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="ความสามารถพิเศษของนักศึกษา"
                        multiline
                        rows={2}
                        {...register("talent")}
                        error={!!errors.talent}
                        helperText={errors.talent?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="งานพิเศษที่เคยทำ"
                        multiline
                        rows={2}
                        {...register("specialWork")}
                        error={!!errors.specialWork}
                        helperText={errors.specialWork?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="ประถม"
                        multiline
                        {...register("primaryEducation")}
                        error={!!errors.primaryEducation}
                        helperText={errors.primaryEducation?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="มัธยมต้น"
                        multiline
                        {...register("middleSchool")}
                        error={!!errors.middleSchool}
                        helperText={errors.middleSchool?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="มัธยมปลาย"
                        multiline
                        {...register("highSchool")}
                        error={!!errors.highSchool}
                        helperText={errors.highSchool?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="ปัจจุบัน"
                        multiline
                        {...register("current")}
                        error={!!errors.current}
                        helperText={errors.current?.message}
                    />
                </Grid>
            </Grid>







            {/* <Button type="submit" variant="contained" color="primary">
                Update
            </Button> */}
        </Box>
    );
};

export default StepSeven;
