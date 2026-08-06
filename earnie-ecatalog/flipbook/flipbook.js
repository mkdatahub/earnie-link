(() => {
  const PAGE_COUNT = 13;
  const bookElement = document.getElementById('book');
  const currentPageEl = document.getElementById('currentPage');
  const totalPagesEl = document.getElementById('totalPages');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const loadMessage = document.getElementById('loadMessage');

  totalPagesEl.textContent = String(PAGE_COUNT);

  const pages = [];
  for (let i = 1; i <= PAGE_COUNT; i += 1) {
    const page = document.createElement('div');
    page.className = 'page';

    const image = document.createElement('img');
    image.src = `./flipbook/pages/page-${String(i).padStart(2, '0')}.jpg`;
    image.alt = `แคตตาล็อกหน้า ${i}`;
    image.loading = i <= 3 ? 'eager' : 'lazy';
    image.draggable = false;

    page.appendChild(image);
    pages.push(page);
    bookElement.appendChild(page);
  }

  function showFallback() {
    bookElement.className = 'book fallback-grid';
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    currentPageEl.textContent = '1';
    loadMessage.textContent = 'แสดงแบบเลื่อน เนื่องจากไม่สามารถโหลดเอฟเฟกต์พลิกหน้าได้';
  }

  if (typeof St === 'undefined' || !St.PageFlip) {
    showFallback();
    return;
  }

  const pageFlip = new St.PageFlip(bookElement, {
    width: 960,
    height: 540,
    size: 'stretch',
    minWidth: 300,
    maxWidth: 1050,
    minHeight: 169,
    maxHeight: 591,
    maxShadowOpacity: 0.28,
    showCover: true,
    mobileScrollSupport: true,
    usePortrait: true,
    flippingTime: 650,
    autoSize: true,
    drawShadow: true
  });

  pageFlip.loadFromHTML(pages);

  function updateControls(index) {
    const displayPage = Math.min(index + 1, PAGE_COUNT);
    currentPageEl.textContent = String(displayPage);
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= PAGE_COUNT - 1;
  }

  pageFlip.on('init', (event) => {
    updateControls(event.data.page);
    loadMessage.hidden = true;
  });

  pageFlip.on('flip', (event) => updateControls(event.data));
  prevBtn.addEventListener('click', () => pageFlip.flipPrev());
  nextBtn.addEventListener('click', () => pageFlip.flipNext());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') pageFlip.flipPrev();
    if (event.key === 'ArrowRight') pageFlip.flipNext();
  });
})();
