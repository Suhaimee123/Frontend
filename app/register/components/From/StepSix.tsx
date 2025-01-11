import { Student } from "@/types/Register";
import { Box, Grid, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";


// Define the structure of the location data


interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const StepSix: React.FC<RegisterFormProps> = ({ formMethods }) => {
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
            <Typography color="secondary" align="center" sx={{ mt: 2 }}>
                ข้อมูลการติดต่อกลับ
            </Typography>
            <Grid container spacing={2}>



                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="ข้อมูลการติดต่อกลับ *"
                        {...register("contactInformation", {
                            required: "กรุณากรอกข้อมูลการติดต่อกลับ",
                          })}
                        error={!!errors.contactInformation}
                        helperText={errors.contactInformation?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="ชื่อ - นามสกุล ผู้ที่สามารถติดต่อได้ในกรณีฉุกเฉิน *"
                        {...register("emergencyContact", {
                            required: "กรุณากรอกชื่อ-นามสกุลของผู้ติดต่อฉุกเฉิน",
                          })}
                        error={!!errors.emergencyContact}
                        helperText={errors.emergencyContact?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="ความสัมพันธ์ * "
                        multiline
                        {...register("relationship", {
                            required: "กรุณากรอกความสัมพันธ์",
                          })}
                        error={!!errors.relationship}
                        helperText={errors.relationship?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="emergencyContactPhoneNumber"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'กรุณากรอกเบอร์โทรศัพท์ของผู้ติดต่อฉุกเฉิน',
                            pattern: {
                                value: /^\d{10}$/,
                                message: 'หมายเลขโทรศัพท์ต้องมี 10 หลัก',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                label="เบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน ที่สามารถติดต่อได้ *"
                                {...field}
                                variant="outlined"
                                error={!!errors.emergencyContactPhoneNumber}
                                helperText={errors.emergencyContactPhoneNumber?.message}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\s+/g, '');
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>





        </Box>
    );
};

export default StepSix;
