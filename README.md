# Earnie Advance Link Hub

หน้าเว็บสำหรับให้ลูกค้าสแกน QR Code แล้วเลือกช่องทางที่ต้องการ

## ไฟล์

- `index.html` หน้าเว็บหลัก
- `style.css` รูปแบบและสี
- `script.js` รายการปุ่มและลิงก์

## วิธีแก้ลิงก์

เปิดไฟล์ `script.js` แล้วแก้ค่า `url` ของแต่ละรายการ เช่น

```js
{
  title: "Facebook",
  subtitle: "ติดตามข่าวสารและโปรโมชั่น",
  icon: "thumb_up",
  url: "https://www.facebook.com/ชื่อเพจของคุณ",
}
```

## วิธีเปลี่ยนเบอร์โทร

เปิด `index.html` แล้วค้นหา

```html
href="tel:0000000000"
```

จากนั้นเปลี่ยนเป็นเบอร์บริษัท เช่น

```html
href="tel:021234567"
```

## วิธีใช้งาน

นำไฟล์ทั้งหมดขึ้น Cloudflare Pages, GitHub Pages หรือโฮสติ้งของบริษัท  
จากนั้นนำ URL ที่ได้ไปสร้าง QR Code เพียง 1 อัน
