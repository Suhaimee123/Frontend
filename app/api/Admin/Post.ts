import { ApiResponseI, PostResponse } from '@/types/IResponse';
import axiosAdmin from '@/utils/axiosAdmin';
import { log } from 'console';

export const createPost = async (
  files: File[],
  describ: string,
  id: string,
  imageName: string,
  imageType: string
): Promise<PostResponse[]> => {  // คาดหวัง response กลับมาเป็น array

  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('files', file);  // เพิ่มไฟล์ทั้งหมดลงใน FormData
    console.log(`File ${index + 1} appended to FormData: ${file.name}`);
  });

  formData.append('content', describ);
  formData.append('id', id);
  formData.append('imageName', imageName);
  formData.append('imageType', imageType);

  try {
    console.log("Sending FormData with multiple files to backend...");

    // ส่งข้อมูลไปยัง backend
    const response = await axiosAdmin.post(`posts/CreateUpload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Response data from backend:", response.data);

    // ตรวจสอบว่า response มีข้อมูลเป็น array หรือไม่
    if (response && Array.isArray(response.data)) {
      return response.data;  // คาดหวังว่า response กลับมาเป็น array
    } else {
      throw new Error('Unexpected response format: Expected an array');
    }
  } catch (error: any) {
    console.error("Error uploading files:", error);
    const errorMessage = error?.response?.data?.message || error.message || "Unknown error occurred";
    console.error("Error message:", errorMessage);
    throw new Error(errorMessage);
  }
};
// export const getAllPosts = async () => {
//   const response = await axiosAdmin.get(`/posts/all`);
//   return response.data; // คาดว่าจะได้รับข้อมูลเป็น List<PostEntity>
// };

export const updatePost = async (
  id: string,
  content: string,
  imageFile?: File
): Promise<PostResponse> => {
  const formData = new FormData();
  formData.append("content", content);
  if (imageFile) {
    formData.append("imageFile", imageFile); // เพิ่มไฟล์รูปภาพใหม่ถ้ามี
  }

  try {
    const response = await axiosAdmin.put(`/posts/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Response data from backend:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating post:", error);
    const errorMessage = error?.response?.data?.message || error.message || "Unknown error occurred";
    throw new Error(errorMessage);
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    await axiosAdmin.delete(`/posts/delete/${id}`);
  } catch (error: any) {
    console.error("Error deleting post:", error);
    throw new Error(error.message || "An error occurred while deleting the post.");
  }
};


export const download = async (imageType: string): Promise<PostResponse> => {
  try {
    // Send GET request and store the response
    const response = await axiosAdmin.get<ApiResponseI<string[]>>(`posts/downloadAllFiles?imageType=${imageType}`);

    console.log(response.data);
    
    
    
    // Extract data from the response
    const images = response.data.data || []; // Ensure you access the images safely

    // Return success response
    return {
      success: true,
      status: 200, // Assuming 200 for a successful response
      message: images.length > 0 ? "Images found" : "No images found",
      data: images,
      error: null,
    };
  } catch (error: any) {
    // Return error response with data as `undefined`
    return {
      success: false,
      status: error?.response?.status || 500,
      message: 'Error fetching images.',
      data: undefined, // Use `undefined` instead of `null`
      error: error?.response?.data?.message || error.message || 'An unknown error occurred.',
    };
  }
};
