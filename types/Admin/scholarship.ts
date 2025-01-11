

export interface Scholarship {
    id?: number;              // Scholarship ID
    studentId?: string;       // รหัสนักเรียน/นักศึกษา
    firstName?: string;       // ชื่อแรกของนักเรียน/นักศึกษา
    imageName?: string;       // ชื่อไฟล์ภาพ
    imageData?: string;       // ข้อมูลภาพ (Base64 หรือ URL)
    createDate?: string;      // วันที่สร้าง (ในรูปแบบ ISO String เช่น '2024-11-25T10:00:00')
    imageType?: string;       // ประเภทของไฟล์ภาพ เช่น 'jpeg', 'png'
    scholarship?: FileList | File[]; 
  }
  