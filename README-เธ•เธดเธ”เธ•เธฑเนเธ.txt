P.V.T. & T. PLAS - Flipbook พร้อมใช้งาน

1) แตก ZIP
2) คัดลอกไฟล์และโฟลเดอร์ทั้งหมดไปไว้ที่ Root ของโปรเจกต์ earnie-link
   - flipbook.html
   - flipbook/
   - catalog/

3) เพิ่มปุ่มใน Link Hub ให้ลิงก์ไปที่:
   ./flipbook.html

ตัวอย่าง HTML:
<a class="link-hub-button" href="./flipbook.html">
  <span>E-Catalog Flipbook</span>
  <span class="material-symbols-outlined">menu_book</span>
</a>

4) Push ขึ้น GitHub:
git add .
git commit -m "Add E-Catalog Flipbook"
git push origin main

หมายเหตุ:
- PDF ใหม่อยู่ที่ catalog/PVTT_E_Catalog_Final050826.pdf
- รูป Flipbook ทั้ง 13 หน้าอยู่ใน flipbook/pages/
- หน้า Flipbook ใช้ PageFlip จาก CDN และมีโหมดเลื่อนสำรองถ้า CDN โหลดไม่ได้
