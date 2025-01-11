"use client";

import React, { useState, useEffect } from 'react';
import LayoutAdmin from '../../components/LayoutAdmin';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { Box, Typography, Grid, TextField, Button, FormHelperText, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, TableContainer, TableHead, TableCell, Table, TableRow, Paper, TableBody } from '@mui/material';
import CustomFileUpload from '@/components/CustomFileUpload';
import { createPost, updatePost, deletePost, download } from '@/app/api/Admin/Post';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import { usePostImages } from '@/hooks/Admin/content';
import { base64ToFile } from '@/components/base64ToFile';
import { FileWithMetadata, Post } from '@/types/IResponse';
import { FormName, useSidebarNavigation } from '../../components/sidebarItems';
import AlertBox from '@/components/Alert/Alert';




const Contract: React.FC = () => {
  const newsMethods = useForm<Post>();
  const { handleSubmit, setValue, watch, control, formState: { errors } } = newsMethods;
  const [selectedForm, setSelectedForm] = useState<FormName>('contract');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { handleSidebarClick, renderSidebarItems } = useSidebarNavigation(setSelectedForm, setExpandedItems);
  const [files, setFiles] = useState<File[]>([]);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newContent, setNewContent] = useState<string>("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { loading: loadingImages, images, error: fetchImagesError, fetchPostImages } = usePostImages();
  const [isFetching, setIsFetching] = useState(false);
  const imageType = "ImageNewsPost";
  const uploadPictureAdmin = watch("ImageNewsPost");


  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [sendFiles, setSendFiles] = useState<File[]>([]);



  const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([]);

  // สำหรับการจัดการ Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);  // ใช้เก็บ id ของโพสต์ที่ต้องการล++บ
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [postImages, setPostImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);  // เพิ่ม state สำหรับการจัดการข้อผิดพลาด

  const handleImageClick = (image: { image: string; name: string }) => {
    console.log("Image clicked:----------------------", image);
    setSelectedImage(image.image);  // อัปเดต selectedImage
    setOpenImageDialog(true);  // เปิด Dialog
  };

  const handleCloseImageDialog = () => {
    console.log("Dialog closed. Resetting selectedImage.");
    setSelectedImage(null);  // รีเซ็ต selectedImage
    setOpenImageDialog(false);  // ปิด Dialog

  };

  const loadImage = async () => {
    if (!selectedImage) return;

    setLoading(true);  // เริ่มการโหลด
    setLoadError(null);  // ล้างข้อผิดพลาดก่อนการโหลด

    try {
      // คุณสามารถใช้ `fetch` หรือฟังก์ชันอื่น ๆ ในการโหลดภาพจากที่เก็บข้อมูล
      const img = new Image();
      img.src = `data:image/png;base64,${selectedImage}`;

      // รอการโหลดภาพเสร็จสิ้น
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      setLoading(false);  // โหลดเสร็จแล้ว
    } catch (error) {
      setLoading(false);  // โหลดเสร็จแล้ว
      setLoadError('ไม่สามารถโหลดภาพได้');  // ตั้งข้อผิดพลาด
    }
  };

  useEffect(() => {
    if (openImageDialog && selectedImage) {
      loadImage();  // โหลดภาพเมื่อเปิด Dialog
    }
  }, [openImageDialog, selectedImage]);  // เมื่อเปิด Dialog หรือ selectedImage เปลี่ยนแปลง







  const fetchImages = async () => {
    // Check if we need to fetch images
    if (
      !isFetching && // Not already fetching
      (!images || images.length === 0) && // No images already loaded
      (!uploadPictureAdmin || uploadPictureAdmin.length === 0) // No images uploaded manually
    ) {
      setIsFetching(true);
      try {
        // Fetch images from the backend
        const result = await fetchPostImages(imageType);
        console.log("Fetched Post images:", result);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsFetching(false);
      }
    } else if (uploadPictureAdmin && uploadPictureAdmin.length > 0) {
      console.log("Images already uploaded, no need to fetch again");
    }
  };

  // Call `fetchImages` when the component mounts or when dependencies change
  useEffect(() => {
    fetchImages();
  }, [uploadPictureAdmin, uploadPictureAdmin]);

  useEffect(() => {
    if (images && images.length > 0) {
      const imageFilesWithMetadata = images.map((imageObj) => {
        const file = base64ToFile(imageObj.image, imageObj.name);
        return { name: imageObj.name, file, imageData: imageObj.imageData, imageType: "ImageNews" };
      });

      // ตรวจสอบว่าไฟล์ที่ได้จาก images แตกต่างจาก filesWithMetadata หรือไม่
      if (JSON.stringify(imageFilesWithMetadata) !== JSON.stringify(filesWithMetadata)) {
        setFilesWithMetadata(imageFilesWithMetadata); // อัปเดตไฟล์
        setValue("ImageNews", imageFilesWithMetadata.map(item => item.file), { shouldValidate: true });
        console.log("Updated ImageNews with images: ", images);
      }
    }
  }, [images, setValue, filesWithMetadata]);


  useEffect(() => {
    if (uploadPictureAdmin) {
      // เมื่อไฟล์มีการอัปโหลดใหม่จาก uploadPictureAdmin
      const uploadedFiles = Array.isArray(uploadPictureAdmin) ? uploadPictureAdmin : Array.from(uploadPictureAdmin) || [];
      setFiles(uploadedFiles); // ตั้งค่า files ใหม่
    } else {
      setFiles([]); // ล้างข้อมูลไฟล์เก่า
      console.log('Files cleared because uploadPictureAdmin is empty');
    }
  }, [uploadPictureAdmin]);


  useEffect(() => {
    // รีเซ็ต files เมื่อมีการโหลดใหม่ หรือเมื่อหน้าเพจเปิดใหม่
    fetchImages(); // ตรวจสอบว่ามีการดึงข้อมูลภาพใหม่หรือไม่
  }, []); // useEffect นี้จะทำงานครั้งเดียวเมื่อหน้าเพจโหลด


  const handleFileChangeForUpdate = (newFiles: File[]) => {
    setFiles(newFiles); // ตั้งค่าไฟล์ใหม่ที่เลือก
  };

  const handleEditPost = (post: Post) => {
    console.log('Editing post:', post); // เช็คค่าของโพสต์ที่จะแก้ไข
    setEditingPost(post); // ตั้งค่าโพสต์ที่จะแก้ไข
    setNewContent(post.content || ""); // กำหนดเนื้อหาของโพสต์
  };



  const handleUpdatePost = async () => {
    if (!editingPost) return;

    setIsUpdating(true);
    try {
      if (newContent.trim()) {
        await updatePost(editingPost.postId, newContent, files[0]);

        // รีเซ็ตค่าและปิด dialog
        setEditingPost(null);
        setFiles([]);
        setNewContent("");

        // ตั้งค่าการแสดงผลของ AlertBox
        setAlertText("อัปเดตโพสต์สำเร็จ");
        setAlertDesc("โพสต์ของคุณได้รับการอัปเดตเรียบร้อยแล้ว");
        setAlertType('success');
        setIsAlertOpen(true);  // เปิด AlertBox

        // รีเฟรชหน้าเพจหลังจากอัปเดต
        setTimeout(() => {
          window.location.reload();  // รีเฟรชหน้า
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error updating post:", error);

      // ตั้งค่าการแสดงผลของ AlertBox ในกรณีเกิดข้อผิดพลาด
      setAlertText("เกิดข้อผิดพลาด");
      setAlertDesc(error.message || "ไม่สามารถอัปเดตโพสต์ได้");
      setAlertType('error');
      setIsAlertOpen(true);  // เปิด AlertBox
    } finally {
      setIsUpdating(false);
    }
  };


  const handleCloseDialog = () => {
    setEditingPost(null); // รีเซ็ตค่าเมื่อปิด Dialog
    setNewContent(""); // รีเซ็ตเนื้อหาที่แก้ไข
  };


  const handleFileChange = (newFiles: File[]) => {
    // ลบไฟล์เก่าก่อน
    setFiles([newFiles[0]]);  // ใช้แค่ไฟล์แรกที่เลือก
    setValue("ImageNews", [newFiles[0]], { shouldValidate: true });  // อัปเดตค่าในฟอร์ม
  };


  const handleFileRemove = (fileToRemove: File) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);  // อัปเดตไฟล์ทั้งหมดเมื่อมีการลบ
    setValue("ImageNewsPost", updatedFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: Post) => {
    const postId = Date.now().toString();
    if (files.length === 0) {
      setResponseMessage("Please upload at least one file.");
      setAlertText("ไม่พบไฟล์ที่อัปโหลด");
      setAlertDesc("กรุณาอัปโหลดไฟล์อย่างน้อยหนึ่งไฟล์");
      setAlertType('error');
      setIsAlertOpen(true);  // เปิด AlertBox
      return;
    }

    const imageName = files[0].name;
    const imageType = "ImageNewsPost";
    setIsLoading(true);
    setResponseMessage("");
    try {
      const response = await createPost(files, data.describ, postId, imageName, imageType);
      if (Array.isArray(response) && response.length > 0) {
        setResponseMessage("Form submitted successfully!");
        setAlertText("สำเร็จ");
        setAlertDesc("ข้อมูลถูกส่งเรียบร้อยแล้ว");
        setAlertType('success');
        setIsAlertOpen(true);  // เปิด AlertBox
        setTimeout(() => {
          window.location.reload();  // รีเฟรชหน้าเว็บหลังจาก 2 วินาที
        }, 2000);
      } else {
        setResponseMessage("Failed to submit: Unknown response format");
        setAlertText("เกิดข้อผิดพลาด");
        setAlertDesc("ไม่สามารถส่งข้อมูลได้");
        setAlertType('error');
        setIsAlertOpen(true);  // เปิด AlertBox
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setResponseMessage(error.message || "An error occurred while submitting the form.");
      setAlertText("เกิดข้อผิดพลาด");
      setAlertDesc(error.message || "ไม่สามารถส่งข้อมูลได้");
      setAlertType('error');
      setIsAlertOpen(true);  // เปิด AlertBox
    } finally {
      setIsLoading(false);
    }
  };


  // ฟังก์ชันลบโพสต์
  const handleDeletePost = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        console.log("Post deleted successfully");

        // ตั้งค่าการแสดงผลของ AlertBox เมื่อโพสต์ถูกลบสำเร็จ
        setAlertText("ลบโพสต์สำเร็จ");
        setAlertDesc("โพสต์ของคุณถูกลบเรียบร้อยแล้ว");
        setAlertType('success');
        setIsAlertOpen(true);  // เปิด AlertBox

        // รีเฟรชหน้า
        window.location.reload();  // รีเฟรชทั้งหน้า

        setOpenDialog(false);
        setPostToDelete(null);
      } catch (error: unknown) {
        console.error("Error deleting post:", error);

        // ใช้ Type Assertion เพื่อบอกให้ TypeScript รู้ว่า error เป็น instance ของ Error
        if (error instanceof Error) {
          setAlertText("เกิดข้อผิดพลาด");
          setAlertDesc(error.message || "ไม่สามารถลบโพสต์ได้");
          setAlertType('error');
          setIsAlertOpen(true);  // เปิด AlertBox
        } else {
          setAlertText("เกิดข้อผิดพลาด");
          setAlertDesc("ไม่สามารถลบโพสต์ได้");
          setAlertType('error');
          setIsAlertOpen(true);  // เปิด AlertBox
        }
      }
    }
  };





  // ฟังก์ชันเปิด Dialog ยืนยันการลบ
  // Function to confirm delete
  const handleConfirmDelete = (id: string) => {
    setPostToDelete(id);
    setOpenDeleteDialog(true);  // เปิด Dialog ยืนยันการลบ
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // ฟังก์ชันปิด Dialog

  return (
    <>
      <LayoutAdmin contentTitle="" sidebarItems={renderSidebarItems} >
        <main>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, mx: 'auto', my: 4 }}
          >
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
              โพสต์ข่าวสาร
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="describ"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Content is required' }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Content"
                      {...field}
                      variant="outlined"
                      multiline
                      rows={4}
                      error={!!errors.describ}
                      helperText={errors.describ?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Upload Files
                </Typography>
                <CustomFileUpload
                  value={files}
                  multiple={false}  // ทำให้เลือกได้แค่ 1 ไฟล์
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                  accept="image/*"
                />

                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {files.length > 0 ? `You have selected 1 file` : "No file selected"}
                </Typography>
              </Grid>

            </Grid>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
            {responseMessage && (
              <Typography variant="body1" color={responseMessage.includes("successfully") ? "success.main" : "error"} sx={{ mt: 4 }}>
                {responseMessage}
              </Typography>
            )}

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              {loading ? (
                <Typography color="textSecondary">กำลังโหลด...</Typography>
              ) : (
                <Table>
                  <TableBody>
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <TableRow key={index}>
                          <TableCell>{image.postId}</TableCell>
                          <TableCell>{image.content}</TableCell>
                          <TableCell>
                            <img
                              src={`data:image/png;base64,${image.image}`}
                              alt={image.name}
                              width={50}
                              style={{ cursor: 'pointer' }}  // เพิ่ม cursor ให้เป็น pointer เมื่อ hover
                              onClick={() => handleImageClick(image)}  // เมื่อคลิกให้แสดง Dialog
                            />
                          </TableCell>
                          <TableCell>{new Date(image.createDate).toLocaleString()}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleEditPost(image)}>Edit</Button>
                            <Button color="error" onClick={() => handleConfirmDelete(image.postId)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body1" color="textSecondary">กำลังโหลด...</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {/* Dialog สำหรับขยายภาพ */}
              <Dialog
                open={openImageDialog}
                onClose={handleCloseImageDialog}
                fullWidth
                maxWidth="md"  // กำหนดขนาดของ Dialog
              >
                <DialogTitle>รูปภาพขยาย</DialogTitle>
                <DialogContent>
                  {selectedImage ? (
                    <>
                      <img
                        src={`data:image/png;base64,${selectedImage}`}
                        alt="Full Image"
                        style={{ width: '100%', height: 'auto' }}
                      />

                    </>
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      ไม่พบรูปภาพ
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseImageDialog} color="secondary">
                    ปิด
                  </Button>
                </DialogActions>
              </Dialog>


            </TableContainer>


            <Dialog
              open={!!editingPost}
              onClose={() => setEditingPost(null)}
              maxWidth="md"  // Keep the width as medium
              fullWidth
            >
              <DialogTitle>แก้ไขโพสต์</DialogTitle>
              <DialogContent sx={{ padding: 4, maxHeight: '90vh', minHeight: '400px', overflow: 'auto' }}>  {/* Increased maxHeight and minHeight */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="แก้ไข Content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    multiline
                    rows={8}  // Increased the number of rows to make the text area taller
                    sx={{ maxWidth: '100%' }}  // Ensure the text field takes up the full width
                  />

                  {/* ส่วนสำหรับอัปโหลดไฟล์ใหม่ */}
                  {/* <Typography variant="body1" sx={{ mt: 2 }}>
                    Upload New File (Optional)
                  </Typography> */}
                  {/* <CustomFileUpload
                    value={files}
                    multiple={false} // ให้เลือกได้เพียง 1 ไฟล์สำหรับอัปเดต
                    onChange={handleFileChangeForUpdate}
                    accept="image/*"
                    onRemove={() => { }} // Removed unused function
                  /> */}
                  {/* <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {files.length > 0 ? `Selected: ${files[0].name}` : "No file selected"}
                  </Typography> */}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditingPost(null)} color="secondary">
                  ยกเลิก
                </Button>
                <Button onClick={handleUpdatePost} color="primary" disabled={!newContent.trim()}>
                  อัปเดต
                </Button>
              </DialogActions>
            </Dialog>


            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DialogTitle>ยืนยันการลบโพสต์</DialogTitle>
              <DialogContent>
                <Typography>คุณแน่ใจหรือว่าต้องการลบโพสต์นี้?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog} color="secondary">
                  ยกเลิก
                </Button>
                <Button color="error" onClick={handleDeletePost}>
                  ลบ
                </Button>
              </DialogActions>
            </Dialog>
          </Box>


        </main>
      </LayoutAdmin>
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

export default Contract;
