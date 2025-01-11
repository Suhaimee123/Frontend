// types/next-auth.d.ts
import { DefaultSession } from 'next-auth';

// เพิ่ม property accessToken
declare module 'next-auth' {
  interface Session {
    accessToken?: string; // ทำให้เป็น optional ถ้าไม่แน่ใจว่าจะมีทุกครั้ง
  }
}
