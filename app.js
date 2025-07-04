// Configuration
const CONFIG = {
    MAX_IMAGES: 30,
    DEFAULT_FRAME_DURATION: 1,
    GIF_QUALITY: 10,
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1920,
    RESOLUTIONS: {
        'auto': null,
        '1080x1920': { width: 1080, height: 1920 },
        '1920x1080': { width: 1920, height: 1080 },
        '1080x1080': { width: 1080, height: 1080 },
        '720x1280': { width: 720, height: 1280 },
        '1280x720': { width: 1280, height: 720 }
    }
};

// State
let uploadedImages = [];
let sortableInstance = null;
let gif = null;

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const selectFilesBtn = document.getElementById('select-files-btn');
const imagesSection = document.getElementById('images-section');
const imagesGrid = document.getElementById('images-grid');
const imageCount = document.getElementById('image-count');
const maxCount = document.getElementById('max-count');
const maxImages = document.getElementById('max-images');
const clearAllBtn = document.getElementById('clear-all-btn');
const controlsSection = document.getElementById('controls');
const frameDuration = document.getElementById('frame-duration');
const generateGifBtn = document.getElementById('generate-gif-btn');
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resultSection = document.getElementById('result-section');
const resultGif = document.getElementById('result-gif');
const downloadBtn = document.getElementById('download-btn');
const createNewBtn = document.getElementById('create-new-btn');
const fadeTransition = document.getElementById('fade-transition');
const resolutionSelect = document.getElementById('resolution-select');
const transitionDuration = document.getElementById('transition-duration');
const transitionDurationGroup = document.getElementById('transition-duration-group');
const imagesPlaceholder = document.getElementById('images-placeholder');
const reorderHint = document.querySelector('.reorder-hint');
const closeResultBtn = document.getElementById('close-result-btn');
const loopGif = document.getElementById('loop-gif');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    setupEventListeners();
    updateMaxImagesDisplay();
    initializeSortable();
});

// Setup event listeners
function setupEventListeners() {
    // File selection
    if (!selectFilesBtn || !fileInput) {
        console.error('Button or file input not found!', { selectFilesBtn, fileInput });
        return;
    }
    
    // Make both button and drop zone clickable
    selectFilesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Select files button clicked');
        fileInput.click();
    });
    
    dropZone.addEventListener('click', (e) => {
        if (e.target === selectFilesBtn || selectFilesBtn.contains(e.target)) {
            return; // Let button handle its own click
        }
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    // Buttons
    clearAllBtn.addEventListener('click', clearAllImages);
    generateGifBtn.addEventListener('click', generateGIF);
    downloadBtn.addEventListener('click', downloadGIF);
    createNewBtn.addEventListener('click', resetApp);
    closeResultBtn.addEventListener('click', closeResult);
    
    // Fade transition checkbox
    fadeTransition.addEventListener('change', (e) => {
        transitionDurationGroup.style.display = e.target.checked ? 'block' : 'none';
    });
}

// Update max images display
function updateMaxImagesDisplay() {
    maxImages.textContent = CONFIG.MAX_IMAGES;
    maxCount.textContent = CONFIG.MAX_IMAGES;
}

// Initialize Sortable
function initializeSortable() {
    sortableInstance = new Sortable(imagesGrid, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function(evt) {
            // Reorder the uploadedImages array based on the new order
            const newOrder = [];
            const items = imagesGrid.querySelectorAll('.image-item');
            items.forEach(item => {
                const index = parseInt(item.dataset.index);
                newOrder.push(uploadedImages[index]);
            });
            uploadedImages = newOrder;
            updateImageIndexes();
        }
    });
}

// File handling
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

// Process uploaded files
function processFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const remainingSlots = CONFIG.MAX_IMAGES - uploadedImages.length;
    
    if (imageFiles.length === 0) {
        showMessage('Please select image files only', 'error');
        return;
    }
    
    if (remainingSlots === 0) {
        showMessage(`Maximum ${CONFIG.MAX_IMAGES} images allowed`, 'error');
        return;
    }
    
    const filesToProcess = imageFiles.slice(0, remainingSlots);
    
    filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                file: file,
                url: e.target.result,
                id: Date.now() + Math.random()
            };
            uploadedImages.push(imageData);
            addImageToGrid(imageData, uploadedImages.length - 1);
            updateUI();
        };
        reader.readAsDataURL(file);
    });
}

// Add image to grid
function addImageToGrid(imageData, index) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.index = index;
    imageItem.dataset.id = imageData.id;
    
    imageItem.innerHTML = `
        <img src="${imageData.url}" alt="Uploaded image">
        <button class="delete-btn" onclick="removeImage(${index})" aria-label="Remove image">×</button>
    `;
    
    imagesGrid.appendChild(imageItem);
}

// Remove image
function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImageGrid();
    updateUI();
}

// Clear all images
function clearAllImages() {
    uploadedImages = [];
    renderImageGrid();
    updateUI();
}

// Render image grid
function renderImageGrid() {
    imagesGrid.innerHTML = '';
    uploadedImages.forEach((imageData, index) => {
        addImageToGrid(imageData, index);
    });
    updateImageIndexes();
}

// Update image indexes after reordering
function updateImageIndexes() {
    const items = imagesGrid.querySelectorAll('.image-item');
    items.forEach((item, index) => {
        item.dataset.index = index;
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.setAttribute('onclick', `removeImage(${index})`);
    });
}

// Update UI visibility
function updateUI() {
    const hasImages = uploadedImages.length > 0;
    
    // Always show images section, but toggle between placeholder and grid
    imagesPlaceholder.style.display = hasImages ? 'none' : 'flex';
    imagesGrid.style.display = hasImages ? 'grid' : 'none';
    clearAllBtn.style.display = hasImages ? 'inline-flex' : 'none';
    reorderHint.style.display = hasImages ? 'block' : 'none';
    
    controlsSection.style.display = hasImages ? 'flex' : 'none';
    imageCount.textContent = uploadedImages.length;
    
    // Reset file input
    fileInput.value = '';
}

// Generate GIF
async function generateGIF() {
    if (uploadedImages.length === 0) {
        showMessage('Please upload images first', 'error');
        return;
    }
    
    // Show progress
    progressSection.style.display = 'block';
    generateGifBtn.disabled = true;
    
    // Get selected resolution
    const selectedResolution = resolutionSelect.value;
    const resolution = CONFIG.RESOLUTIONS[selectedResolution];
    
    // Determine target dimensions
    let targetWidth, targetHeight;
    if (resolution) {
        targetWidth = resolution.width;
        targetHeight = resolution.height;
    } else {
        // Auto mode - determine from first image
        const firstImg = new Image();
        await new Promise((resolve) => {
            firstImg.onload = resolve;
            firstImg.src = uploadedImages[0].url;
        });
        
        const aspectRatio = firstImg.width / firstImg.height;
        if (aspectRatio > 1) {
            // Landscape
            targetWidth = Math.min(firstImg.width, CONFIG.MAX_WIDTH);
            targetHeight = Math.round(targetWidth / aspectRatio);
        } else {
            // Portrait or square
            targetHeight = Math.min(firstImg.height, CONFIG.MAX_HEIGHT);
            targetWidth = Math.round(targetHeight * aspectRatio);
        }
    }
    
    // Initialize GIF encoder with target dimensions
    gif = new GIF({
        workers: 2,
        quality: CONFIG.GIF_QUALITY,
        workerScript: 'libs/gif.worker.js',
        width: targetWidth,
        height: targetHeight,
        repeat: loopGif.checked ? 0 : -1  // 0 = loop forever, -1 = no loop
    });
    
    // Get frame duration and fade option
    const duration = parseFloat(frameDuration.value) * 1000;
    const useFade = fadeTransition.checked;
    
    // Process each image
    for (let i = 0; i < uploadedImages.length; i++) {
        const imageData = uploadedImages[i];
        const img = new Image();
        
        await new Promise(async (resolve, reject) => {
            img.onload = async () => {
                // Create canvas with target dimensions
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                
                // Fill background (in case image doesn't fill entire canvas)
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, targetWidth, targetHeight);
                
                // Calculate scaling to fit image in canvas while maintaining aspect ratio
                const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = (targetWidth - scaledWidth) / 2;
                const y = (targetHeight - scaledHeight) / 2;
                
                // Draw image centered
                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                
                // Add frame to GIF
                if (useFade && i < uploadedImages.length - 1) {
                    // Add fade transition frames
                    const fadeFrames = 10; // More frames for smoother transition
                    const customTransitionDuration = parseFloat(transitionDuration.value) * 1000;
                    const fadeDuration = customTransitionDuration; // Use full transition duration
                    
                    // Calculate frame durations
                    const mainFrameDuration = Math.max(100, duration - fadeDuration); // At least 100ms for main frame
                    const fadeFrameDuration = fadeDuration / fadeFrames;
                    
                    // Main frame (show the image clearly)
                    gif.addFrame(canvas, { delay: mainFrameDuration, copy: true });
                    
                    // Load next image for crossfade
                    const nextImageData = uploadedImages[i + 1];
                    const nextImg = new Image();
                    await new Promise((resolve) => {
                        nextImg.onload = resolve;
                        nextImg.src = nextImageData.url;
                    });
                    
                    // Create fade transition frames
                    for (let f = 1; f <= fadeFrames; f++) {
                        const fadeCanvas = document.createElement('canvas');
                        const fadeCtx = fadeCanvas.getContext('2d', { willReadFrequently: true });
                        fadeCanvas.width = targetWidth;
                        fadeCanvas.height = targetHeight;
                        
                        // Fill background
                        fadeCtx.fillStyle = '#000000';
                        fadeCtx.fillRect(0, 0, targetWidth, targetHeight);
                        
                        // Draw current image with decreasing opacity
                        fadeCtx.globalAlpha = 1 - (f / fadeFrames);
                        fadeCtx.drawImage(canvas, 0, 0);
                        
                        // Draw next image with increasing opacity
                        fadeCtx.globalAlpha = f / fadeFrames;
                        const nextScale = Math.min(targetWidth / nextImg.width, targetHeight / nextImg.height);
                        const nextScaledWidth = nextImg.width * nextScale;
                        const nextScaledHeight = nextImg.height * nextScale;
                        const nextX = (targetWidth - nextScaledWidth) / 2;
                        const nextY = (targetHeight - nextScaledHeight) / 2;
                        fadeCtx.drawImage(nextImg, nextX, nextY, nextScaledWidth, nextScaledHeight);
                        
                        gif.addFrame(fadeCanvas, { delay: fadeFrameDuration });
                    }
                } else {
                    // No fade, just show the frame
                    gif.addFrame(canvas, { delay: duration });
                }
                
                // Update progress
                const progress = ((i + 1) / uploadedImages.length) * 100;
                updateProgress(progress * 0.5); // First 50% for processing images
                
                resolve();
            };
            img.onerror = reject;
            img.src = imageData.url;
        });
    }
    
    // Render GIF
    gif.on('progress', (p) => {
        updateProgress(50 + (p * 50)); // Last 50% for rendering
    });
    
    gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        showResult(url);
        progressSection.style.display = 'none';
        generateGifBtn.disabled = false;
    });
    
    gif.render();
}

// Update progress
function updateProgress(percent) {
    progressFill.style.width = percent + '%';
    progressText.textContent = Math.round(percent) + '%';
}

// Show result
function showResult(url) {
    resultGif.src = url;
    resultSection.style.display = 'block';
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Download GIF
function downloadGIF() {
    const link = document.createElement('a');
    link.href = resultGif.src;
    link.download = `animated-${Date.now()}.gif`;
    link.click();
}

// Reset app
function resetApp() {
    uploadedImages = [];
    renderImageGrid();
    updateUI();
    resultSection.style.display = 'none';
    progressSection.style.display = 'none';
    frameDuration.value = CONFIG.DEFAULT_FRAME_DURATION;
    
    // Clean up blob URL
    if (resultGif.src.startsWith('blob:')) {
        URL.revokeObjectURL(resultGif.src);
    }
    
    // Abort GIF generation if in progress
    if (gif) {
        gif.abort();
        gif = null;
    }
}

// Close result modal
function closeResult() {
    resultSection.style.display = 'none';
}

// Show message (for future enhancement)
function showMessage(message, type) {
    // For now, just use alert
    alert(message);
}