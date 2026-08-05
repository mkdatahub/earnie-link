const products = window.PVTT_PRODUCTS || [];
const grid = document.getElementById('productGrid');
const search = document.getElementById('productSearch');
const count = document.getElementById('productCount');
const empty = document.getElementById('emptyState');
document.getElementById('year').textContent = new Date().getFullYear();
function render(items){
  grid.innerHTML = items.map(p => `<a class="card" href="./product.html?id=${encodeURIComponent(p.id)}"><div class="card-image"><img src="${p.image}" alt="${p.nameTh}" loading="lazy"><span class="number">${p.no}</span></div><div class="card-body"><h2>${p.nameTh}</h2><div class="en">${p.nameEn}</div><p>${p.summary}</p><div class="card-link"><span>ดูรายละเอียดสินค้า</span><span>→</span></div></div></a>`).join('');
  count.textContent = `แสดง ${items.length} จาก ${products.length} รายการ`;
  empty.style.display = items.length ? 'none' : 'block';
}
search.addEventListener('input', e => { const q=e.target.value.trim().toLowerCase(); render(products.filter(p => [p.nameTh,p.nameEn,p.summary,p.usage].join(' ').toLowerCase().includes(q))); });
render(products);
