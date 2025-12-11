// PDF.js Worker Configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// DOM Elements
const pdfFileInput = document.getElementById('pdfFile');
const createBtn = document.getElementById('createBtn');
const statusDiv = document.getElementById('status');
const fileNameSpan = document.getElementById('file-name');
const langSwitch = document.getElementById('langSwitch');
const howToBtn = document.getElementById('howToBtn');
const howToModal = document.getElementById('howToModal');
const closeModal = document.querySelector('.close');

// State
let pageImageUrls = [];
let currentLang = 'tr';

// Language Translations
const translations = {
    processing: { tr: 'İşleniyor...', en: 'Processing...' },
    converting: { tr: 'PDF sayfaları resme dönüştürülüyor...', en: 'Converting PDF pages to images...' },
    pageProgress: { tr: 'Sayfa {current}/{total} işlendi...', en: 'Page {current}/{total} processed...' },
    error: { tr: 'Hata:', en: 'Error:' },
    popupError: { tr: 'Lütfen açılır pencerelere izin verin.', en: 'Please allow pop-up windows.' }
};

// Language Switch Functionality
function switchLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-tr]').forEach(element => {
        const key = lang === 'tr' ? 'data-tr' : 'data-en';
        element.textContent = element.getAttribute(key);
    });
}

langSwitch.addEventListener('change', (e) => {
    switchLanguage(e.target.checked ? 'en' : 'tr');
});

// Modal Functionality
howToBtn.addEventListener('click', () => {
    howToModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    howToModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === howToModal) {
        howToModal.style.display = 'none';
    }
});

// PDF Processing
pdfFileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    fileNameSpan.textContent = file.name;
    createBtn.disabled = true;
    createBtn.textContent = translations.processing[currentLang];
    
    statusDiv.className = 'loading';
    statusDiv.style.display = 'block';
    statusDiv.textContent = translations.converting[currentLang];
    
    pageImageUrls = [];
    
    try {
        const typedarray = new Uint8Array(await file.arrayBuffer());
        const pdfDoc = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const numPages = pdfDoc.numPages;
        const scale = 2.0;
        const quality = 0.9;
        
        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');
            
            await page.render({ 
                canvasContext: context, 
                viewport 
            }).promise;
            
            pageImageUrls.push(canvas.toDataURL('image/jpeg', quality));
            page.cleanup();
            
            const progressText = translations.pageProgress[currentLang]
                .replace('{current}', i)
                .replace('{total}', numPages);
            statusDiv.textContent = progressText;
        }
        
        statusDiv.style.display = 'none';
        createBtn.disabled = false;
        
        const buttonText = currentLang === 'tr' ? 'Flipbook Oluştur' : 'Create Flipbook';
        createBtn.textContent = buttonText;
        
    } catch (error) {
        console.error('PDF Processing Error:', error);
        statusDiv.className = 'error';
        statusDiv.textContent = `${translations.error[currentLang]} ${error.message}`;
    }
});

// Create Flipbook
createBtn.addEventListener('click', () => {
    const flipbookWindow = window.open('', '_blank');
    
    if (!flipbookWindow) {
        statusDiv.className = 'error';
        statusDiv.style.display = 'block';
        statusDiv.textContent = translations.popupError[currentLang];
        return;
    }
    
    flipbookWindow.document.write(generateFlipbookHTML(pageImageUrls, fileNameSpan.textContent));
    flipbookWindow.document.close();
});

// Generate Flipbook HTML
function generateFlipbookHTML(imageUrls, fileName) {
    const css = `
        <style>
            :root {
                --turn-duration: 0.8s;
            }
            
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background-color: #333;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            .page-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .flipbook-viewport {
                flex-grow: 1;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                perspective: 2500px;
                overflow: hidden;
            }
            
            #zoom-container {
                transition: transform 0.3s ease;
            }
            
            #flipbook {
                max-width: 95vw;
                max-height: 85vh;
                position: relative;
                display: flex;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                transform-style: preserve-3d;
                cursor: pointer;
            }
            
            .page-side {
                width: 50%;
                height: 100%;
                background-color: white;
                overflow: hidden;
            }
            
            .page-side img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .page-side.left {
                border-radius: 8px 0 0 8px;
            }
            
            .page-side.right {
                border-radius: 0 8px 8px 0;
            }
            
            .turning-leaf {
                position: absolute;
                width: 50%;
                height: 100%;
                transform-style: preserve-3d;
                transition: transform var(--turn-duration) cubic-bezier(0.645, 0.045, 0.355, 1);
                z-index: 100;
                pointer-events: none;
            }
            
            .turning-leaf.forward {
                top: 0;
                left: 50%;
                transform-origin: left center;
            }
            
            .turning-leaf.forward.flipped {
                transform: rotateY(-180deg);
            }
            
            .turning-leaf.backward {
                top: 0;
                left: 0;
                transform-origin: right center;
            }
            
            .turning-leaf.backward.flipped {
                transform: rotateY(180deg);
            }
            
            .turning-leaf .page {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                background-color: white;
                overflow: hidden;
            }
            
            .turning-leaf .page img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .turning-leaf .back {
                transform: rotateY(180deg);
            }
            
            .toolbar {
                flex-shrink: 0;
                padding: 20px 0;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
                width: 100%;
            }
            
            .toolbar button {
                background-color: rgba(0, 0, 0, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 12px 24px;
                cursor: pointer;
                border-radius: 8px;
                font-size: 16px;
                transition: all 0.3s ease;
                font-weight: 600;
            }
            
            .toolbar button:hover {
                background-color: rgba(0, 0, 0, 0.9);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .toolbar button:active {
                transform: translateY(0);
            }
        </style>
    `;

    const htmlBody = `
        <div class="page-wrapper">
            <div class="flipbook-viewport">
                <div id="zoom-container">
                    <div id="flipbook">
                        <div class="page-side left" id="leftPage"></div>
                        <div class="page-side right" id="rightPage"></div>
                    </div>
                </div>
            </div>
            <div class="toolbar">
                <button id="fullscreenBtn">Tam Ekran / Fullscreen</button>
                <button id="prevBtn">◀ Önceki / Previous</button>
                <button id="zoomOutBtn">- Uzaklaş / Zoom Out</button>
                <button id="zoomInBtn">+ Yakınlaş / Zoom In</button>
                <button id="nextBtn">Sonraki / Next ▶</button>
                <button id="downloadBtn">İndir / Download</button>
            </div>
        </div>
    `;

    const js = `
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const pageImageUrls = ${JSON.stringify(imageUrls)};
                const flipbook = document.getElementById('flipbook');
                const leftPage = document.getElementById('leftPage');
                const rightPage = document.getElementById('rightPage');
                const zoomContainer = document.getElementById('zoom-container');

                let spreads = [];
                let currentSpread = 0;
                let isTurning = false;
                let pageAspectRatio = 16 / 9;
                let currentZoom = 1.0;
                const MAX_ZOOM = 3.0;
                const MIN_ZOOM = 0.5;
                const ZOOM_STEP = 0.2;

                function prepareSpreads() {
                    spreads.push([null, pageImageUrls[0]]);
                    for (let i = 1; i < pageImageUrls.length; i += 2) {
                        spreads.push([
                            pageImageUrls[i],
                            (i + 1 < pageImageUrls.length) ? pageImageUrls[i + 1] : null
                        ]);
                    }
                }

                function calculateAndSetAspectRatio() {
                    if (!pageImageUrls[0]) return;
                    
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        pageAspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
                        flipbook.style.aspectRatio = 2 * pageAspectRatio;
                        updateStaticPages();
                    };
                    tempImg.src = pageImageUrls[0];
                }

                function updateStaticPages() {
                    const spread = spreads[currentSpread];
                    if (!spread) return;
                    
                    leftPage.innerHTML = spread[0] ? \`<img src="\${spread[0]}">\` : '';
                    rightPage.innerHTML = spread[1] ? \`<img src="\${spread[1]}">\` : '';
                }
                
                function turnPage(direction) {
                    if (isTurning) return;
                    
                    const nextSpread = currentSpread + direction;
                    if (nextSpread < 0 || nextSpread >= spreads.length) return;
                    
                    isTurning = true;
                    
                    const oldSpreadData = spreads[currentSpread];
                    const nextSpreadData = spreads[nextSpread];
                    
                    const turningLeaf = document.createElement('div');
                    turningLeaf.className = 'turning-leaf';
                    
                    const front = document.createElement('div');
                    front.className = 'page front';
                    
                    const back = document.createElement('div');
                    back.className = 'page back';

                    if (direction > 0) {
                        if (oldSpreadData[1]) {
                            front.innerHTML = \`<img src="\${oldSpreadData[1]}">\`;
                        }
                        if (nextSpreadData[0]) {
                            back.innerHTML = \`<img src="\${nextSpreadData[0]}">\`;
                        }
                        turningLeaf.classList.add('forward');
                        leftPage.innerHTML = oldSpreadData[0] ? \`<img src="\${oldSpreadData[0]}">\` : '';
                        rightPage.innerHTML = nextSpreadData[1] ? \`<img src="\${nextSpreadData[1]}">\` : '';
                    } else {
                        if (oldSpreadData[0]) {
                            front.innerHTML = \`<img src="\${oldSpreadData[0]}">\`;
                        }
                        if (nextSpreadData[1]) {
                            back.innerHTML = \`<img src="\${nextSpreadData[1]}">\`;
                        }
                        turningLeaf.classList.add('backward');
                        leftPage.innerHTML = nextSpreadData[0] ? \`<img src="\${nextSpreadData[0]}">\` : '';
                        rightPage.innerHTML = oldSpreadData[1] ? \`<img src="\${oldSpreadData[1]}">\` : '';
                    }

                    turningLeaf.append(front, back);
                    flipbook.appendChild(turningLeaf);
                    
                    requestAnimationFrame(() => {
                        turningLeaf.classList.add('flipped');
                    });
                    
                    const turnDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--turn-duration')) * 1000;
                    
                    setTimeout(() => {
                        currentSpread = nextSpread;
                        updateStaticPages();
                        turningLeaf.remove();
                        isTurning = false;
                    }, turnDuration);
                }

                function applyZoom() {
                    zoomContainer.style.transform = \`scale(\${currentZoom})\`;
                }
                
                function zoomIn() {
                    if (currentZoom < MAX_ZOOM) {
                        currentZoom = Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP);
                        applyZoom();
                    }
                }
                
                function zoomOut() {
                    if (currentZoom > MIN_ZOOM) {
                        currentZoom = Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP);
                        applyZoom();
                    }
                }

                function downloadSelf() {
                    const pageSource = document.documentElement.outerHTML;
                    const blob = new Blob([pageSource], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '${fileName}.html';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                
                // Event Listeners
                document.getElementById('nextBtn').addEventListener('click', () => turnPage(1));
                document.getElementById('prevBtn').addEventListener('click', () => turnPage(-1));
                document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
                document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
                document.getElementById('downloadBtn').addEventListener('click', downloadSelf);
                
                flipbook.addEventListener('click', (e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    if (e.clientX > rect.left + rect.width / 2) {
                        turnPage(1);
                    } else {
                        turnPage(-1);
                    }
                });
                
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowRight') turnPage(1);
                    if (e.key === 'ArrowLeft') turnPage(-1);
                });
                
                const fullscreenBtn = document.getElementById('fullscreenBtn');
                fullscreenBtn.addEventListener('click', () => {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                });

                // Initialize
                prepareSpreads();
                calculateAndSetAspectRatio();
            });
        <\/script>
    `;

    return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${fileName}</title>${css}</head><body>${htmlBody}${js}</body></html>`;
}