import { Student } from "@/types/Register";
import { Box, Grid, Typography, Button, FormHelperText, TextField } from "@mui/material";
import { UseFormReturn, Controller, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import CustomFileUpload from "@/components/CustomFileUpload";

interface RegisterFormProps {
    formMethods: UseFormReturn<Student>;
}

const StepTwelve: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,

    } = formMethods;

    const volunteerPictures = watch("volunteerPictures");
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);


    useEffect(() => {
        if (volunteerPictures instanceof FileList) {
            setFiles(Array.from(volunteerPictures));
        } else if (Array.isArray(volunteerPictures)) {
            setFiles(volunteerPictures);
        }
    }, [volunteerPictures]);

    const handleFileChange = (newFiles: File[]) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        setValue("volunteerPictures", updatedFiles, { shouldValidate: true });
    };

    const handleFileRemove = (fileToRemove: File) => {
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        setValue("volunteerPictures", updatedFiles, { shouldValidate: true });
    };

    const validateFiles = () => {
        if (files.length < 2) {
            setFileError("กรุณาอัพโหลดรูปอย่างน้อย 2 รูป");
            return false;
        }
        setFileError(null);
        return true;
    };

    const onSubmit = (data: Student) => {
        if (!validateFiles()) return;

        console.log("Form Data: ", data);
        console.log("Uploaded Files: ", data.volunteerPictures);


        // Proceed with form submission logic
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
                ภาพทำจิตอาสา 1-5 รูป เป็นจิอาสาที่ทำย้อนหลังไม่เกิน 1 ปี
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>

                    <CustomFileUpload
                        value={files}
                        multiple
                        onChange={handleFileChange}
                        onRemove={handleFileRemove}
                        accept="image/*"
                    />
                    {errors && (
                        <FormHelperText error>{fileError}</FormHelperText>
                    )}
                </Grid>

            </Grid>

            {/* <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            ส่งข้อมูล
          </Button> */}
        </Box>
    );
};

export default StepTwelve;