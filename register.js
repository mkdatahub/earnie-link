/* ======================================================
   P.V.T. & T. Plas Registration Flow + Supabase V1
====================================================== */

const SUPABASE_URL = "https://egfzqxirbekoiyjdtrmi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Jjfl66ZhnbvniceB2xXsUw_JvRybsrz";
const BUSINESS_CARD_BUCKET = "business-cards";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

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
let activeEvent = null;

currentYear.textContent = new Date().getFullYear();

function showView(viewToShow) {
  [choiceView, cardView, formView, successView].forEach((view) => {
    view.hidden = view !== viewToShow;
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

cardChoiceButton.addEventListener("click", () => showView(cardView));
formChoiceButton.addEventListener("click", () => showView(formView));
backButtons.forEach((button) => {
  button.addEventListener("click", () => showView(choiceView));
});

async function loadActiveEvent() {
  const { data, error } = await supabaseClient
    .from("booth_events")
    .select("id,event_code,event_name")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Cannot load booth event:", error);
    throw new Error("ไม่สามารถโหลดข้อมูลงานได้ กรุณาลองใหม่อีกครั้ง");
  }

  activeEvent = data;
  return data;
}

async function getActiveEvent() {
  if (activeEvent) return activeEvent;
  return loadActiveEvent();
}

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

  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
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
  cardImageError.textContent = "";
  cardConsentError.textContent = "";

  if (!selectedFile) {
    cardImageError.textContent = "กรุณาถ่ายหรือเลือกรูปนามบัตร";
    return;
  }

  if (!cardConsent.checked) {
    cardConsentError.textContent = "กรุณากดยินยอมก่อนส่งข้อมูล";
    return;
  }

  setButtonLoading(cardSubmitButton, "กำลังส่งนามบัตร...");

  try {
    const eventData = await getActiveEvent();
    const registrationCode = createReferenceNumber();
    const filePath = createBusinessCardPath(selectedFile, eventData?.event_code);

    const { error: uploadError } = await supabaseClient.storage
      .from(BUSINESS_CARD_BUCKET)
      .upload(filePath, selectedFile, {
        cacheControl: "3600",
        contentType: selectedFile.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { error: insertError } = await supabaseClient
      .from("event_registrations")
      .insert({
        event_id: eventData?.id ?? null,
        registration_code: registrationCode,
        registration_type: "business_card",
        business_card_path: filePath,
        business_card_original_name: selectedFile.name || "business-card.jpg",
        business_card_mime_type: selectedFile.type || "image/jpeg",
        business_card_size_bytes: selectedFile.size,
        consent: true,
        consent_at: new Date().toISOString(),
        registered_at: new Date().toISOString(),
      });

    if (insertError) throw insertError;

    finishRegistration(registrationCode);
  } catch (error) {
    console.error("Business card registration failed:", error);
    showSubmitError(cardImageError, error);
    resetButton(cardSubmitButton, "redeem", "ส่งนามบัตรและรับสิทธิ์");
  }
});

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
  phoneNumberInput.value = phoneNumberInput.value.replace(/[^0-9+\-\s]/g, "");
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
    showFieldError(customerNameInput, customerNameError, "กรุณากรอกชื่อผู้ติดต่อ");
    isValid = false;
  }

  if (!companyName) {
    showFieldError(companyNameInput, companyNameError, "กรุณากรอกชื่อบริษัทหรือร้านค้า");
    isValid = false;
  }

  if (!phoneNumber) {
    showFieldError(phoneNumberInput, phoneNumberError, "กรุณากรอกเบอร์โทรศัพท์");
    isValid = false;
  } else if (!isValidPhone(phoneNumber)) {
    showFieldError(phoneNumberInput, phoneNumberError, "กรุณาตรวจสอบเบอร์โทรศัพท์อีกครั้ง");
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
    registerForm.querySelector(".is-invalid")?.focus();
    return;
  }

  setButtonLoading(formSubmitButton, "กำลังลงทะเบียน...");

  try {
    const eventData = await getActiveEvent();
    const registrationCode = createReferenceNumber();

    const { error } = await supabaseClient
      .from("event_registrations")
      .insert({
        event_id: eventData?.id ?? null,
        registration_code: registrationCode,
        registration_type: "manual",
        customer_name: customerNameInput.value.trim(),
        company_name: companyNameInput.value.trim(),
        phone_number: phoneNumberInput.value.trim(),
        consent: true,
        consent_at: new Date().toISOString(),
        registered_at: new Date().toISOString(),
      });

    if (error) throw error;
    finishRegistration(registrationCode);
  } catch (error) {
    console.error("Manual registration failed:", error);
    showSubmitError(formConsentError, error);
    resetButton(formSubmitButton, "redeem", "ลงทะเบียนรับสิทธิ์");
  }
});

function setButtonLoading(button, message) {
  button.disabled = true;
  button.innerHTML = `
    <span class="material-symbols-outlined">hourglass_top</span>
    <span>${message}</span>
  `;
}

function resetButton(button, icon, message) {
  button.disabled = false;
  button.innerHTML = `
    <span class="material-symbols-outlined">${icon}</span>
    <span>${message}</span>
  `;
}

function createReferenceNumber() {
  const now = new Date();
  const datePart = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = crypto.getRandomValues(new Uint32Array(1))[0]
    .toString()
    .slice(-6)
    .padStart(6, "0");

  return `PVT-${datePart}-${randomPart}`;
}

function createBusinessCardPath(file, eventCode) {
  const now = new Date();
  const safeEventCode = String(eventCode || "general")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-");
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const extension = getFileExtension(file);
  const fileId = crypto.randomUUID();

  return `${safeEventCode}/${year}/${month}/${fileId}.${extension}`;
}

function getFileExtension(file) {
  const extensionFromName = file.name?.split(".").pop()?.toLowerCase();
  if (extensionFromName && /^[a-z0-9]+$/.test(extensionFromName)) {
    return extensionFromName;
  }

  const mimeExtensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };

  return mimeExtensions[file.type] || "jpg";
}

function showSubmitError(targetElement, error) {
  const message = String(error?.message || "");

  if (message.includes("registration_code")) {
    targetElement.textContent = "กรุณารันไฟล์ SQL_PATCH ก่อน แล้วลองอีกครั้ง";
    return;
  }

  if (message.toLowerCase().includes("row-level security")) {
    targetElement.textContent = "สิทธิ์ Supabase ยังไม่พร้อม กรุณาตรวจสอบ RLS Policy";
    return;
  }

  targetElement.textContent = "บันทึกไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่";
}

function finishRegistration(registrationCode) {
  referenceNumber.textContent = registrationCode;
  showView(successView);
}

loadActiveEvent().catch((error) => {
  console.warn(error.message);
});
