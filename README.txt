P.V.T. & T. Plas Registration Flow – Supabase V1

เชื่อมต่อแล้วกับ:
https://egfzqxirbekoiyjdtrmi.supabase.co

ลำดับติดตั้ง
1. เปิด Supabase > SQL Editor
2. รันไฟล์ SQL_PATCH_registration_code.sql เพียงครั้งเดียว
3. นำไฟล์ register.html, register.css และ register.js ขึ้น Cloudflare
4. เปิด /register แล้วทดสอบทั้ง 2 วิธี

การทำงาน
- กรอกข้อมูล: บันทึกลง public.event_registrations
- ถ่ายนามบัตร: อัปโหลดเข้า Storage business-cards แล้วบันทึก path ลงตาราง
- Bucket ยังเป็น Private
- หน้าเว็บใช้ Publishable Key เท่านั้น ไม่ได้ใช้ Service Role Key

ตรวจสอบผล
- Supabase > Table Editor > event_registrations
- Supabase > Storage > business-cards
