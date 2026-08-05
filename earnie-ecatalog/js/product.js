const products = window.PVTT_PRODUCTS || [];
const id = new URLSearchParams(location.search).get('id');
const product = products.find(p => p.id === id) || products[0];
const detail = document.getElementById('productDetail');
document.getElementById('year').textContent = new Date().getFullYear();
document.title = `${product.nameTh} | P.V.T. & T. PLAS`;
detail.innerHTML = `<div class="detail-media"><img src="${product.image}" alt="${product.nameTh}"></div><div class="detail-content"><div class="num">PRODUCT ${product.no}</div><h1>${product.nameTh}</h1><div class="en-title">${product.nameEn}</div><p class="lead">${product.summary}</p><div class="specs">${product.specs.map(([k,v]) => `<div class="spec"><strong>${k}</strong><span>${v}</span></div>`).join('')}</div><div class="usage"><strong>การใช้งาน</strong><br>${product.usage}</div><div class="detail-actions"><a class="btn primary" href="./catalog/PVTT_E_Catalog_050826.pdf" target="_blank">เปิด PDF Catalog</a><a class="btn" href="./catalog.html">ดูสินค้าอื่น</a></div></div>`;
