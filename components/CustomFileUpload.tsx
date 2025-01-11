import React, { useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface CustomFileUploadProps {
    value: File[];
    multiple?: boolean;
    onChange: (files: File[]) => void;
    onRemove: (file: File) => void;
    accept?: string;
}

const CustomFileUpload: React.FC<CustomFileUploadProps> = ({ value, multiple = false, onChange, onRemove, accept }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        onChange(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        onChange(files);
    };

    return (
        <div
            style={{
                border: `2px dashed ${dragOver ? 'blue' : 'gray'}`,
                padding: '16px',
                borderRadius: '4px',
                textAlign: 'center',
                position: 'relative',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="file-upload-input"
            />
            <label htmlFor="file-upload-input" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Button variant="contained" component="span" sx={{ color: 'white', backgroundColor: 'primary.main' }}>
                    Upload Files
                </Button>
            </label>
            {value.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    <Typography variant="body2">Selected Files:</Typography>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {value.map((file, index) => (
                            <li key={`${file.name}-${index}`} style={{ alignItems: 'center', marginBottom: '8px' }}>
                                {file.name}
                                <IconButton onClick={() => onRemove(file)} aria-label="delete" style={{ marginLeft: '16px' }}>
                                    <DeleteIcon />
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomFileUpload;