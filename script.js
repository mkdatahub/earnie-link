/* ======================================================
   P.V.T. & T. Plas Link Hub
   แก้ไขลิงก์ทั้งหมดได้ในตัวแปร links ด้านล่าง
====================================================== */

const links = [
  {
    title: "เว็บไซต์หลัก",
    subtitle: "รู้จักสินค้าและบริการของเรา",
    icon: "language",
    url: "http://www.pvttplas.com/th",
  },
  // {
  //   title: "LINE Official",
  //   subtitle: "สอบถามสินค้าและพูดคุยกับฝ่ายขาย",
  //   icon: "chat",
  //   url: "https://line.me/",
  // },
  // {
  //   title: "Facebook",
  //   subtitle: "ติดตามข่าวสารและโปรโมชั่น",
  //   icon: "thumb_up",
  //   url: "https://www.facebook.com/",
  // },
  // {
  //   title: "Shopee",
  //   subtitle: "เลือกซื้อสินค้าผ่าน Shopee",
  //   icon: "shopping_bag",
  //   url: "https://shopee.co.th/",
  // },
  // {
  //   title: "Lazada",
  //   subtitle: "เลือกซื้อสินค้าผ่าน Lazada",
  //   icon: "storefront",
  //   url: "https://www.lazada.co.th/",
  // },
  // {
  //   title: "TikTok",
  //   subtitle: "ชมวิดีโอสินค้าและการใช้งาน",
  //   icon: "smart_display",
  //   url: "https://www.tiktok.com/",
  // },
  // {
  //   title: "แผนที่บริษัท",
  //   subtitle: "ดูตำแหน่งและเส้นทางการเดินทาง",
  //   icon: "location_on",
  //   url: "https://maps.google.com/",
  // },
];

const linkList = document.getElementById("linkList");
const currentYear = document.getElementById("currentYear");

function createLinkButton(item) {
  const link = document.createElement("a");

  link.className = "link-button";
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.innerHTML = `
    <span class="link-icon">
      <span class="material-symbols-outlined">${item.icon}</span>
    </span>

    <span class="link-copy">
      <span class="link-title">${item.title}</span>
      <span class="link-subtitle">${item.subtitle}</span>
    </span>

    <span class="material-symbols-outlined link-arrow">
      arrow_forward_ios
    </span>
  `;

  return link;
}

function renderLinks() {
  linkList.innerHTML = "";

  links.forEach((item) => {
    linkList.appendChild(createLinkButton(item));
  });
}

currentYear.textContent = new Date().getFullYear();
renderLinks();
