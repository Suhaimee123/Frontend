

export interface Student {


  // ข้อมูลส่วนบุคคล
  id?: number;  // รหัสนักเรียน
  studentId?: string;  // รหัสประจำตัวนักเรียน
  prefix?: string;  // คำนำหน้า
  firstName?: string;  // ชื่อ
  thaiName?: string;  // ชื่อภาษาไทย
  lastName?: string;  // นามสกุล
  nickname?: string;  // ชื่อเล่น
  dateOfBirth?: string;  // วันเกิด (รูปแบบวันที่ ISO 8601)
  gender?: string;  // เพศ
  nationalId?: string;  // เลขบัตรประชาชน
  email?: string;  // อีเมล
  phoneNumber?: string;  // หมายเลขโทรศัพท์
  faculty?: string;  // คณะ
  fieldOfStudy?: string;  // สาขาวิชา
  currentlyStudyingYear?: string;  // ปีที่กำลังศึกษา
  studentType?: string;  // ประเภทนักศึกษา
  block?: string;  // บล็อคที่เรียน
  currentGpa?: string;  // เกรดเฉลี่ยปัจจุบัน (ในรูปแบบสตริงหากใช้ BigDecimal)
  createDate?: string;  // วันที่สร้างข้อมูล (รูปแบบวันที่-เวลา ISO 8601)
  placeOfStudy?: string;  // สถานที่ศึกษา
  otherPlace?: string;  // สถานที่ศึกษาอื่นๆ


  // ที่อยู่ปัจจุบัน
  currentAddress: string;  // ที่อยู่ปัจจุบัน
  studentResident: string;  // ที่พักนักศึกษา
  numberOfResidents: string;  // จำนวนผู้อยู่อาศัย
  currentProvince: string;  // จังหวัดปัจจุบัน
  currentDistrict: string;  // อำเภอปัจจุบัน
  currentSubdistrict: string;  // ตำบลปัจจุบัน
  currentPostalCode: string;  // รหัสไปรษณีย์ปัจจุบัน
  addressAccordingToHouseRegistration: string;  // ที่อยู่ตามทะเบียนบ้าน
  province: string;  // จังหวัด
  district: string;  // อำเภอ
  subdistrict: string;  // ตำบล
  postalCode: string;  // รหัสไปรษณีย์
  

  // ทุนการศึกษา   Scholarships
  advisorNameSurname?: string; // อาจารย์ที่ปรึกษา ชื่อ - นามสกุล
  advisorPhoneNumber?: string; // เบอร์โทรอาจารย์ที่ปรึกษา
  knowThePimSmartFundFrom?: string; // รู้จักกองทุน PIM SMART จาก
  additionalDetails?: string; // Add this field
  scholarshipReceived?: string;  // ทุนการศึกษาที่ได้รับ
  otherScholarships?: string; // ทุนการศึกษาอื่น ๆ
  educationLoan?: string; // กยศ สินเชื่อเพื่อการศึกษา
  graduatedFromSchool?: string; //จบจากโรงเรียน
  provinceSchool?: string; //จังหวัด(โรงเรียน)


  //Student personal information

  lineId?: string; // ไลน์ไอดีของผู้ใช้ (ไม่จำเป็นต้องกรอก)
  facebook?: string; // บัญชีเฟสบุ๊คของผู้ใช้ (ไม่จำเป็นต้องกรอก)
  fatherNameSurname?: string; // ชื่อ-สกุลของบิดา (ไม่จำเป็นต้องกรอก)
  motherNameSurname?: string; // ชื่อ-สกุลของมารดา (ไม่จำเป็นต้องกรอก)
  occupationFather?: string; // อาชีพของบิดา (ไม่จำเป็นต้องกรอก)
  occupationMother?: string; // อาชีพของมารดา (ไม่จำเป็นต้องกรอก)
  estimateFatherMonthlyIncome?: string; // รายได้ต่อเดือนโดยประมาณของบิดา (ไม่จำเป็นต้องกรอก)
  motherApproximateMonthlyIncome?: string; // รายได้ต่อเดือนโดยประมาณของมารดา (ไม่จำเป็นต้องกรอก)
  fatherAddress?: string; // ที่อยู่ของบิดา (ไม่จำเป็นต้องกรอก)
  fatherAddressDetails?: string; // รายละเอียดที่อยู่ของบิดา (ไม่จำเป็นต้องกรอก)
  motherAddress?: string; // ที่อยู่ของมารดา (ไม่จำเป็นต้องกรอก)
  motherAddressDetails?: string; // รายละเอียดที่อยู่ของมารดา (ไม่จำเป็นต้องกรอก)


  // ข้อมูลด้านสุขภาพ
  congenitalDisease?: string;  // โรคประจำตัว 
  paternalMemoryDisorder?: string;  //โรคจำตัวบิดา
  maternalMemoryDisorder?: string;  //โรคจำตัวมารดา
  fatherStatus?: string;  //สถานภาพบิดา
  fatherStatusDetails?: string;  //สถานภาพบิดา
  maternalStatus?: string;  //สถานภาพมารดา
  maternalStatusDetails?: string;  //สถานภาพมารดา
  haveSiblings?: string, //มีพี่น้อง ( รวมนักศึกษา )
  woman?: string, //เป็นหญิง

  //StepFive
  addressValue?: string;  // ระบุค่าที่อยู่รายเดือนรวมน้ำไฟ ( เช่าบ้าน/หอ )
  roundTripTravel?: string; //การเดินทางไปกลับ
  householdExpenses?: string; //ค่าใช้จ่ายภายในบ้าน
  familyDebt?: string; //หนี้สินครอบครัว

  //StepSix
  contactInformation?: string; //ข้อมูลการติดต่อกลับ
  emergencyContact?: string; //ชื่อ - นามสกุล ผู้ที่สามารถติดต่อได้ในกรณีฉุกเฉิน
  relationship?: string; //ความสัมพันธ์
  emergencyContactPhoneNumber?: string; //เบอร์โทรศัพท์ผู้ติดต่อฉุกเฉิน ที่สามารถติดต่อได้


  //StepSeven
  beautyEnhancement?: string; //เสริมความงาม
  beautyEnhancementDetails?: string; //เสริมความงาม
  man?: string, //เป็นชาย
  personWho?: string, //นักศึกษาเป็นลูกคนที่
  parentInformation?: string, //นักศึกษาเป็นลูกคนที่
  talent?: string, //ความสามารถพิเศษของนักศึกษา
  primaryEducation?: string, //ประถม
  middleSchool?: string, //มัธยมต้น
  highSchool?: string, //มัธยมปลาย
  current?: string, //ปัจจุบัน
  specialWork?: string, //งานพิเศษที่เคยทำ


  //StepEight
  hope?: string; //ความมุ่งหวังหลังจากจบการศึกษา
  committee?: string; //อยากบอกอะไรกับคณะกรรมการฯ


  //StepNine
  familyHistory?: string; //เล่าประวัติครอบครัวคร่าวๆ และเหตุผลในการขอทุน มีความจำเป็น ความเดือนร้อน ความต้องการให้กองทุนฯช่วยเหลือ


  //StepTen
  studentPicture?: FileList | File[]; //อัพโหลดรูปนักศึกษา
  uploadPictureHouse?: FileList | File[]; //อัพโหลดอย่างน้อย 2 รูป ภาพรวมนอกบ้าน ภาพรวมในบ้าน
  volunteerPictures?: FileList | File[]; //ภาพทำจิตอาสา 1-5 รูป เป็นจิอาสาที่ทำย้อนหลังไม่เกิน 1 ปี



  status? : string;
  // ข้อคำร้อง
  specialRequest?: string;  // คำร้องขอพิเศษ
  applicationId?: Number;

}

export interface StudentPicture {
  imageType: string; // ข้อมูลไฟล์
  name: string; // ชื่อไฟล์
  image: string; // Base64 encoded string or URL of the image
}


export interface UploadedFile {
  file: File;  // ข้อมูลไฟล์
  name: string; // ชื่อไฟล์
}


// Location interface for geographic data
export interface Location {
  province: string;
  district: string;
  subdistrict: string;
  zipcode: string;
}

