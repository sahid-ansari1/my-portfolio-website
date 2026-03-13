// Certificate data with image paths
const certificateData = {
    'be10x-certificate': {
        title: 'AI Tools Workshop - Be10x',
        image: 'certificates/be10x-certificate.jpg', // यहाँ अपनी certificate image का path है
        downloadName: 'Be10x_AI_Tools_Certificate.jpg'
    }
};

let currentZoom = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

function showCertificateImage(certificateId) {
    const certificate = certificateData[certificateId];
    if (!certificate) return;

    const modal = document.getElementById('certificate-modal');
    const title = document.getElementById('modal-title');
    const image = document.getElementById('certificate-image');

    title.textContent = certificate.title;
    image.src = certificate.image;
    image.dataset.certificateId = certificateId;

    modal.classList.add('active');
    
    currentZoom = 1;
    image.style.transform = 'scale(1) translate(0, 0)';
    
    image.style.opacity = '0';
    image.onload = () => {
        setTimeout(() => {
            image.style.opacity = '1';
        }, 100);
    };

    document.body.style.overflow = 'hidden';
}

function closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        const image = document.getElementById('certificate-image');
        image.src = '';
        currentZoom = 1;
    }, 400);
}

function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.5, 3);
    updateImageTransform();
}

function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.5, 0.5);
    updateImageTransform();
}

function resetZoom() {
    currentZoom = 1;
    const image = document.getElementById('certificate-image');
    image.style.transform = 'scale(1) translate(0, 0)';
}

function updateImageTransform() {
    const image = document.getElementById('certificate-image');
    image.style.transform = `scale(${currentZoom})`;
}

function downloadCertificate() {
    const image = document.getElementById('certificate-image');
    const certificateId = image.dataset.certificateId;
    const certificate = certificateData[certificateId];
    
    if (!certificate) return;

    const link = document.createElement('a');
    link.href = certificate.image;
    link.download = certificate.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.portfolioManager) {
        window.portfolioManager.showNotification('Certificate downloaded successfully! 📄', 'success');
    }
}

function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: 'Check out my certificate!',
            text: 'I completed this certification course.',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        if (window.portfolioManager) {
            window.portfolioManager.showNotification('Link copied to clipboard! 📋', 'success');
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCertificateModal();
    }
});
