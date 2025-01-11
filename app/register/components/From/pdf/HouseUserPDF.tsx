import { Box, Grid, Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";

interface RegisterFormProps {
    formMethods: UseFormReturn<any>;
}

const HouseUserPDF: React.FC<RegisterFormProps> = ({ formMethods }) => {
    const { watch } = formMethods;

    const uploadPictureHouse = watch("uploadPictureHouse");
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (uploadPictureHouse) {
            setFiles(
                Array.isArray(uploadPictureHouse)
                    ? uploadPictureHouse
                    : Array.from(uploadPictureHouse) || []
            );
        } else {
            setFiles([]); // Clear files if volunteerPictures is undefined
        }
    }, [uploadPictureHouse]);

    return (
        <Box
            component="form"
            sx={{
                width: "720px",
                height: "119vh",
                mx: "auto",
            }}
        >
            <Box sx={{ mt: 2, position: "relative", width: "100%" }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Typography
                            color="secondary"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "10px",
                                marginBottom: "50px",
                            }}
                        >
                            รูปบ้านตามภูมิลำเนา
                        </Typography>
                    </Grid>
                    {files.length > 0 &&
                        files.map((file, index) => (
                            <Grid
                                item
                                xs={files.length === 2 ? 12 : 6} // Full width for 2 images, half width for more
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={URL.createObjectURL(file)}
                                    alt={`Uploaded file ${index + 1}`}
                                    sx={{
                                        width: "90%",
                                        maxWidth: "300px",
                                        height: "auto",
                                        border: "2px dashed #1976d2",
                                        borderRadius: 1,
                                        boxShadow: 2,
                                        objectFit: "contain",
                                    }}
                                />
                            </Grid>
                        ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default HouseUserPDF;
