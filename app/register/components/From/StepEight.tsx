import { Box, Grid, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Student } from "@/types/Register";


// Define the structure of the location data


interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const StepEight: React.FC<RegisterFormProps> = ({ formMethods }) => {
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
                ความมุ่งหวังและสิ่งที่อยากบอกกับคณะกรรมการ
            </Typography>
            <Grid container spacing={2}>




                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="ความมุ่งหวังหลังจากจบการศึกษา"
                        multiline
                        rows={2}
                        {...register("hope")}
                        error={!!errors.hope}
                        helperText={errors.hope?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="อยากบอกอะไรกับคณะกรรมการฯ"
                        multiline
                        rows={2}
                        {...register("committee")}
                        error={!!errors.committee}
                        helperText={errors.committee?.message}
                    />
                </Grid>
                
            </Grid>






{/* 
            <Button type="submit" variant="contained" color="primary">
                Update
            </Button> */}
        </Box>
    );
};

export default StepEight;
