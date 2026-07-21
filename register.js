/* ======================================================
   P.V.T. & T. Plas Registration Page
   เวอร์ชันเริ่มต้น: ตรวจสอบข้อมูลและแสดงหน้าสำเร็จ

   หมายเหตุ:
   ตอนนี้ข้อมูลยังไม่ได้ส่งเข้า Supabase
   สามารถนำส่วน submit ไปเชื่อมฐานข้อมูลภายหลังได้
====================================================== */

const registerForm = document.getElementById("registerForm");
const successPanel = document.getElementById("successPanel");

const customerNameInput = document.getElementById("customerName");
const companyNameInput = document.getElementById("companyName");
const phoneNumberInput = document.getElementById("phoneNumber");
const consentInput = document.getElementById("consent");

const customerNameError = document.getElementById("customerNameError");
const companyNameError = document.getElementById("companyNameError");
const phoneNumberError = document.getElementById("phoneNumberError");
const consentError = document.getElementById("consentError");

const submitButton = document.getElementById("submitButton");
const referenceNumber = document.getElementById("referenceNumber");
const currentYear = document.getElementById("currentYear");

/* ------------------------------------------------------
   แสดงปีปัจจุบันใน Footer
------------------------------------------------------ */
currentYear.textContent = new Date().getFullYear();

/* ------------------------------------------------------
   ล้างข้อความ Error ของช่องที่กำหนด
------------------------------------------------------ */
function clearFieldError(input, errorElement) {
  input.classList.remove("is-invalid");
  errorElement.textContent = "";
}

/* ------------------------------------------------------
   แสดงข้อความ Error ของช่องที่กำหนด
------------------------------------------------------ */
function showFieldError(input, errorElement, message) {
  input.classList.add("is-invalid");
  errorElement.textContent = message;
}

/* ------------------------------------------------------
   จัดรูปแบบเบอร์โทรให้เหลือเฉพาะตัวเลข
   เครื่องหมาย + ขีด และช่องว่าง
------------------------------------------------------ */
phoneNumberInput.addEventListener("input", () => {
  phoneNumberInput.value = phoneNumberInput.value.replace(
    /[^0-9+\-\s]/g,
    ""
  );

  clearFieldError(phoneNumberInput, phoneNumberError);
});

/* ------------------------------------------------------
   เมื่อลูกค้าเริ่มพิมพ์ ให้ล้าง Error เดิม
------------------------------------------------------ */
customerNameInput.addEventListener("input", () => {
  clearFieldError(customerNameInput, customerNameError);
});

companyNameInput.addEventListener("input", () => {
  clearFieldError(companyNameInput, companyNameError);
});

consentInput.addEventListener("change", () => {
  consentError.textContent = "";
});

/* ------------------------------------------------------
   ตรวจสอบรูปแบบเบอร์โทรเบื้องต้น
   ยอมรับเบอร์ประมาณ 9-15 หลัก
------------------------------------------------------ */
function isValidPhone(phone) {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 9 && digitsOnly.length <= 15;
}

/* ------------------------------------------------------
   สร้างหมายเลขลงทะเบียนแบบง่าย
   ตัวอย่าง PVT-4821
------------------------------------------------------ */
function createReferenceNumber() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `PVT-${randomNumber}`;
}

/* ------------------------------------------------------
   ตรวจสอบข้อมูลทั้งหมด
------------------------------------------------------ */
function validateForm() {
  let isValid = true;

  const customerName = customerNameInput.value.trim();
  const companyName = companyNameInput.value.trim();
  const phoneNumber = phoneNumberInput.value.trim();

  clearFieldError(customerNameInput, customerNameError);
  clearFieldError(companyNameInput, companyNameError);
  clearFieldError(phoneNumberInput, phoneNumberError);
  consentError.textContent = "";

  if (!customerName) {
    showFieldError(
      customerNameInput,
      customerNameError,
      "กรุณากรอกชื่อผู้ติดต่อ"
    );
    isValid = false;
  }

  if (!companyName) {
    showFieldError(
      companyNameInput,
      companyNameError,
      "กรุณากรอกชื่อบริษัทหรือร้านค้า"
    );
    isValid = false;
  }

  if (!phoneNumber) {
    showFieldError(
      phoneNumberInput,
      phoneNumberError,
      "กรุณากรอกเบอร์โทรศัพท์"
    );
    isValid = false;
  } else if (!isValidPhone(phoneNumber)) {
    showFieldError(
      phoneNumberInput,
      phoneNumberError,
      "กรุณาตรวจสอบเบอร์โทรศัพท์อีกครั้ง"
    );
    isValid = false;
  }

  if (!consentInput.checked) {
    consentError.textContent = "กรุณากดยินยอมก่อนลงทะเบียน";
    isValid = false;
  }

  return isValid;
}

/* ------------------------------------------------------
   เมื่อกดปุ่มลงทะเบียน
------------------------------------------------------ */
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalidInput = registerForm.querySelector(".is-invalid");

    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }

    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = `
    <span class="material-symbols-outlined">hourglass_top</span>
    <span>กำลังลงทะเบียน...</span>
  `;

  /* ----------------------------------------------------
     เตรียมข้อมูลสำหรับส่งเข้า Supabase ในขั้นตอนถัดไป
  ---------------------------------------------------- */
  const registrationData = {
    customer_name: customerNameInput.value.trim(),
    company_name: companyNameInput.value.trim(),
    phone_number: phoneNumberInput.value.trim(),
    consent: consentInput.checked,
    registered_at: new Date().toISOString(),
  };

  /*
    จุดเชื่อม Supabase ภายหลัง ตัวอย่าง:

    const { data, error } = await window.supabaseClient
      .from("event_registrations")
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
  */

  console.log("Registration data:", registrationData);

  /* จำลองการส่งข้อมูลเล็กน้อย */
  await new Promise((resolve) => setTimeout(resolve, 500));

  referenceNumber.textContent = createReferenceNumber();

  registerForm.hidden = true;
  successPanel.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
