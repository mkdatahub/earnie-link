/* ======================================================
   P.V.T. & T. Plas Registration Flow
   เลือกระหว่าง:
   1) ถ่ายนามบัตร
   2) กรอกข้อมูลด้วยตนเอง

   หมายเหตุ:
   เวอร์ชันนี้ทำงานด้านหน้าจอครบแล้ว
   แต่ยังไม่ได้บันทึกข้อมูลหรือรูปเข้า Supabase
====================================================== */

/* =========================
   อ้างอิงส่วนต่าง ๆ ของหน้า
========================= */

const choiceView = document.getElementById("choiceView");
const cardView = document.getElementById("cardView");
const formView = document.getElementById("formView");
const successView = document.getElementById("successView");

const cardChoiceButton = document.getElementById("cardChoiceButton");
const formChoiceButton = document.getElementById("formChoiceButton");
const backButtons = document.querySelectorAll("[data-back-to-choice]");

const cardForm = document.getElementById("cardForm");
const businessCardImage = document.getElementById("businessCardImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const cardPreview = document.getElementById("cardPreview");
const retakeButton = document.getElementById("retakeButton");
const cardImageError = document.getElementById("cardImageError");
const cardConsent = document.getElementById("cardConsent");
const cardConsentError = document.getElementById("cardConsentError");
const cardSubmitButton = document.getElementById("cardSubmitButton");

const registerForm = document.getElementById("registerForm");
const customerNameInput = document.getElementById("customerName");
const companyNameInput = document.getElementById("companyName");
const phoneNumberInput = document.getElementById("phoneNumber");
const formConsent = document.getElementById("formConsent");

const customerNameError = document.getElementById("customerNameError");
const companyNameError = document.getElementById("companyNameError");
const phoneNumberError = document.getElementById("phoneNumberError");
const formConsentError = document.getElementById("formConsentError");
const formSubmitButton = document.getElementById("formSubmitButton");

const referenceNumber = document.getElementById("referenceNumber");
const currentYear = document.getElementById("currentYear");

let previewObjectUrl = null;

/* =========================
   แสดงปีปัจจุบัน
========================= */

currentYear.textContent = new Date().getFullYear();

/* =========================
   ฟังก์ชันเปลี่ยนหน้าภายในหน้าเดียว
========================= */

function showView(viewToShow) {
  [choiceView, cardView, formView, successView].forEach((view) => {
    view.hidden = view !== viewToShow;
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* =========================
   ปุ่มเลือกวิธีลงทะเบียน
========================= */

cardChoiceButton.addEventListener("click", () => {
  showView(cardView);
});

formChoiceButton.addEventListener("click", () => {
  showView(formView);
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showView(choiceView);
  });
});

/* =========================
   ส่วนถ่ายนามบัตร
========================= */

function clearCardPreview() {
  businessCardImage.value = "";

  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = null;
  }

  cardPreview.src = "";
  cardPreview.hidden = true;
  uploadPlaceholder.hidden = false;
  retakeButton.hidden = true;
  cardImageError.textContent = "";
}

businessCardImage.addEventListener("change", () => {
  const selectedFile = businessCardImage.files?.[0];

  cardImageError.textContent = "";

  if (!selectedFile) {
    clearCardPreview();
    return;
  }

  if (!selectedFile.type.startsWith("image/")) {
    clearCardPreview();
    cardImageError.textContent = "กรุณาเลือกไฟล์รูปภาพเท่านั้น";
    return;
  }

  const maximumSize = 8 * 1024 * 1024;

  if (selectedFile.size > maximumSize) {
    clearCardPreview();
    cardImageError.textContent = "รูปภาพมีขนาดใหญ่เกิน 8 MB";
    return;
  }

  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
  }

  previewObjectUrl = URL.createObjectURL(selectedFile);

  cardPreview.src = previewObjectUrl;
  cardPreview.hidden = false;
  uploadPlaceholder.hidden = true;
  retakeButton.hidden = false;
});

retakeButton.addEventListener("click", () => {
  clearCardPreview();
  businessCardImage.click();
});

cardConsent.addEventListener("change", () => {
  cardConsentError.textContent = "";
});

cardForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const selectedFile = businessCardImage.files?.[0];
  let isValid = true;

  cardImageError.textContent = "";
  cardConsentError.textContent = "";

  if (!selectedFile) {
    cardImageError.textContent = "กรุณาถ่ายหรือเลือกรูปนามบัตร";
    isValid = false;
  }

  if (!cardConsent.checked) {
    cardConsentError.textContent = "กรุณากดยินยอมก่อนส่งข้อมูล";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  setButtonLoading(cardSubmitButton, "กำลังส่งนามบัตร...");

  /*
    ข้อมูลที่เตรียมไว้สำหรับส่งเข้า Supabase:

    const cardRegistrationData = {
      registration_type: "business_card",
      consent: true,
      registered_at: new Date().toISOString(),
    };

    รูป selectedFile สามารถอัปโหลดเข้า Supabase Storage ได้
    แล้วนำ URL ของรูปไปบันทึกในตาราง event_registrations
  */

  console.log("Business card file:", selectedFile);

  await fakeSubmitDelay();

  finishRegistration();
});

/* =========================
   ส่วนกรอกข้อมูลด้วยตนเอง
========================= */

function clearFieldError(input, errorElement) {
  input.classList.remove("is-invalid");
  errorElement.textContent = "";
}

function showFieldError(input, errorElement, message) {
  input.classList.add("is-invalid");
  errorElement.textContent = message;
}

customerNameInput.addEventListener("input", () => {
  clearFieldError(customerNameInput, customerNameError);
});

companyNameInput.addEventListener("input", () => {
  clearFieldError(companyNameInput, companyNameError);
});

phoneNumberInput.addEventListener("input", () => {
  phoneNumberInput.value = phoneNumberInput.value.replace(
    /[^0-9+\-\s]/g,
    ""
  );

  clearFieldError(phoneNumberInput, phoneNumberError);
});

formConsent.addEventListener("change", () => {
  formConsentError.textContent = "";
});

function isValidPhone(phone) {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 9 && digitsOnly.length <= 15;
}

function validateManualForm() {
  let isValid = true;

  const customerName = customerNameInput.value.trim();
  const companyName = companyNameInput.value.trim();
  const phoneNumber = phoneNumberInput.value.trim();

  clearFieldError(customerNameInput, customerNameError);
  clearFieldError(companyNameInput, companyNameError);
  clearFieldError(phoneNumberInput, phoneNumberError);
  formConsentError.textContent = "";

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

  if (!formConsent.checked) {
    formConsentError.textContent = "กรุณากดยินยอมก่อนลงทะเบียน";
    isValid = false;
  }

  return isValid;
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateManualForm()) {
    const firstInvalidInput = registerForm.querySelector(".is-invalid");

    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }

    return;
  }

  setButtonLoading(formSubmitButton, "กำลังลงทะเบียน...");

  const registrationData = {
    registration_type: "manual",
    customer_name: customerNameInput.value.trim(),
    company_name: companyNameInput.value.trim(),
    phone_number: phoneNumberInput.value.trim(),
    consent: formConsent.checked,
    registered_at: new Date().toISOString(),
  };

  /*
    จุดเชื่อม Supabase ภายหลัง:

    const { data, error } = await window.supabaseClient
      .from("event_registrations")
      .insert(registrationData)
      .select()
      .single();
  */

  console.log("Manual registration data:", registrationData);

  await fakeSubmitDelay();

  finishRegistration();
});

/* =========================
   ฟังก์ชันส่วนกลาง
========================= */

function setButtonLoading(button, message) {
  button.disabled = true;
  button.innerHTML = `
    <span class="material-symbols-outlined">hourglass_top</span>
    <span>${message}</span>
  `;
}

function fakeSubmitDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

function createReferenceNumber() {
  const now = new Date();
  const datePart = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `PVT-${datePart}-${randomPart}`;
}

function finishRegistration() {
  referenceNumber.textContent = createReferenceNumber();
  showView(successView);
}
