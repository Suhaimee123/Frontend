
export interface PostResponse {
  status: number;
  message: string;
  data?: string[];
  error: string | null;
  success: boolean;
}

export interface Post {
  postId: string;
  describ: string;
  content: string;
  imageNames: string;
  imageData: string;
  
  // imageName: string;
  // imageType: string;
  createDate?: string;
  // imageData?: string;
  // imageNames?: string;
  // image_data?: string;
  ImageNews?: FileList | File[];
  ImageNewsPost?: FileList | File[];
 
  
}



export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;

}

// Define the response type for the backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | null; // ใช้ประเภทเจนเนอริกที่นี่
  error?: string;
  token?: string; // Add token to the ApiResponse type
  

}

export interface ApiResponseS<T> {
  success: boolean;
  totalCount: number; // Include totalCount here
  message: string;
  data?: T | null; // ใช้ประเภทเจนเนอริกที่นี่
  error?: string;
  token?: string; // Add token to the ApiResponse type

}

export interface ApiResponseI<T> {
  success: boolean; // Indicates if the API request was successful
  message: string; // Contains a message, usually for success or error details
  data?: T | null; // Holds the data returned from the API (generic type), which can also be null
  error?: string; // Error message in case the request fails
}



export interface FileWithMetadata {
  name: any;
  imageType: string;
  file: File;
  imageData: string;
}

export interface ErrorResponse {
  message?: string;
}



export interface UploadFilesResult {
  success: boolean;
  message?: string;
}


// In '@/types/IResponse.ts'
export interface User {
  id: number; // Adjust the type based on your API response
  username: string;
  email: string;
  createdIn: string; // Adjust based on the actual data type, e.g., ISO date string
}



// Volunteer form values structure
// export interface FormValues {
//   // uploadVolunteer?: FileList | File[];  // Files for volunteer work uploads
//   prefix?: string;                      // Prefix (Mr., Ms., Dr., etc.)
//   studentId?: string;                   // Student ID
//   firstName?: string;                   // Full name of the student
//   nickname?: string;                    // Nickname of the student
//   graduate?: string;                    // Graduation year or status
//   branch?: string;                      // Branch of study
//   activityName?: string;                // Volunteer activity name
//   organizationName?: string;            // Organization name
//   organizationPhone?: string;           // Organization phone number
//   activityDescription?: string;         // Description of the volunteer activity
//   activityDate?: string;                // Date of the activity
//   hours?: number;   
//   id:number; 
//   volunteerPictures?: File[]; // เพิ่มฟิลด์นี้
  
 

//                      // Number of hours volunteered
// }

// Special work form values structure
// export interface Post {
//   id: string; // รหัสของโพสต์
//   content: string; // เนื้อหาของโพสต์
//   PostImage?: FileList | File[];
//   imageName: string; // ชื่อของรูปภาพ
//   imageType: string; // ประเภทของรูปภาพ
//   createdAt: Date; // วันที่สร้างโพสต์
//   updatedAt?: Date; // วันที่แก้ไขล่าสุด (อาจมีหรือไม่มีก็ได้)
//   authorId: string; // รหัสผู้เขียน
//   postId:string;
//   status: 'draft' | 'published' | 'archived'; // สถานะของโพสต์
// }

export interface FormValuesWork {
  studentId?: string;                   // Student ID
  prefix?: string;                      // Prefix (Mr., Ms., Dr., etc.)
  firstName?: string;                   // Full name of the student
  nickname?: string;                    // Nickname of the student
  graduate?: string;                    // Graduation year or status
  branch?: string;                      // Branch of study
  workName?: string;                    // Special work name
  organizationName?: string;            // Organization name
  organizationPhone?: string;           // Organization phone number
  workDescription?: string;             // Description of the special work
  activityDate?: string;                // Date of the activity
  hours?: number;                       // Number of hours worked
  workType?: string;                    // Type of work (e.g., paid, volunteer)
  compensation?: number;                // Compensation received, if any
  workDates?: string;                   // Work dates
  workTime?: string;  
  Specialwork ?: string;                  // Work time
  uploadSpecialwork?: FileList | File[]; // File(s) for special work upload
  specialworkId?:string
  id?:string
  
  uploadVolunteer?:FileList| File

}

// Response structure when fetching volunteer hours
export interface VolunteerHoursResponse {
  id: string;                           // Unique ID for the volunteer activity
  studentId: string;                    // Student ID
  firstName: string;                    // Full name of the student
  activityName: string;                 // Volunteer activity name
  organizationName: string;             // Organization name
  organizationPhone: string;            // Organization phone number
  activityDescription: string;          // Description of the volunteer activity
  activityDate: string;                 // Date of the activity
  hours: number;                        // Number of hours volunteered
}

// Props for the VolunteerForm component
// export interface VolunteerFormProps {
//   onSubmit: (formValues: FormValues) => Promise<void>;  // Submit handler for the form
//   formValues: FormValues;                              // Current form values
//   setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;  // Setter for form values
//   success: string | null;                              // Success message
//   error: string | null;                                // Error message
//   loading: boolean;                                    // Loading state
//   setError: (error: string | null) => void;            // Function to set error message
//   setLoading: (loading: boolean) => void;              // Function to set loading state
//   setSuccessMessage: (message: string | null) => void; // Function to set success message
// }

// Props for the SpecialWorkForm component
export interface SpecialWorkFormProps {
  onSubmit: (formValues: SpecialWorkFormData) => Promise<void>;  // Submit handler for the form
  formValues: SpecialWorkFormData;                               // Current form values
  setFormValues: React.Dispatch<React.SetStateAction<SpecialWorkFormData>>;  // Setter for form values
  success: string | null;                                        // Success message
  error: string | null;                                          // Error message
  loading: boolean;                                              // Loading state
}

// Data structure for special work form submissions
export interface SpecialWorkFormData {
  studentId: string;                    // Student ID
  title: string;                        // Title (Mr., Ms., etc.)
  firstName: string;                    // Full name of the student
  nickname: string;                     // Nickname of the student
  graduate: string;                     // Graduation year or status
  branch: string;                       // Branch of study
  activityName: string;                 // Special work activity name
  organizationName: string;             // Organization name
  organizationPhone: string;            // Organization phone number
  activityDescription: string;          // Description of the activity
  activityDate: string;                 // Date of the activity
  hours: string;                        // Hours worked
  createDate: string;                   // Creation date of the record
  yearLevel: string;                    // Year level of the student
  loanStatus: string;                   // Loan status of the student
}

// State management interface
export interface State {
  selectedForm: string;                 // Currently selected form type
  // formValues: FormValues;               // Current values of the form
  success: string | null;               // Success message
  error: string | null;                 // Error message
  loading: boolean;                     // Loading state
  volunteerHours: number | null;        // Total volunteer hours
}
// Interface for volunteer hours response
export interface VolunteerHoursResponse {
  id: string;
  studentId: string;
  firstName: string;
  activityName: string;
  organizationName: string;
  organizationPhone: string;
  activityDescription: string;
  activityDate: string;
  hours: number;
}

// Interface for special work response
export interface SpecialWorkResponse {
  studentId: string;
  firstName: string;
  activityName: string;
  organizationName: string;
  organizationPhone: string;
  activityDescription: string;
  activityDate: string;
  hours: number;
}

export interface SpecialWorkResponse {
  studentId: string;
  firstName: string;
  workName: string;
  organizationName: string;
  organizationPhone: string;
  workDescription: string;
  workDate: string;
  hours: number;
  createDate: string;
}
export interface VolunteerHoursResponse {
  studentId: string;
  firstName: string;
  activityName: string;
  organizationName: string;
  organizationPhone: string;
  activityDescription: string;
  activityDate: string;
  hours: number;
  createDate: string;
}

// If you have other exports, include them as well
