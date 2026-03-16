/**
 * ═══════════════════════════════════════════════════════════════════════
 *  SAHID ANSARI — PORTFOLIO  |  certificate.js
 *
 *  DSA used:
 *  ─ Map<string, Object>  : O(1) certificate data lookup
 *  ─ Clamp (math)         : zoom bounds without branching
 * ═══════════════════════════════════════════════════════════════════════
 */

'use strict';

/* ── Certificate registry — DSA: Map<id, data> for O(1) lookup ── */
const CERTS = new Map([
  [
    'be10x-certificate',
    {
      title:        'AI Tools Workshop — Be10x',
      src:          'certificates/be10x-certificate.jpg',
      downloadName: 'Be10x_AI_Tools_Certificate.jpg',
    },
  ],
  /* Add more certificates here:
  [
    'cert-id',
    { title: '...', src: 'certificates/....jpg', downloadName: '....jpg' },
  ],
  */
]);

/* ── Zoom state ── */
const ZOOM = { current: 1, min: 0.5, max: 3, step: 0.4 };

/* ── Drag state ── */
const DRAG = { active: false, startX: 0, startY: 0, lastX: 0, lastY: 0 };

/* ══════════════════════════════════════════════════════════════════════
   OPEN MODAL
══════════════════════════════════════════════════════════════════════ */
function showCertificateImage(id) {
  const cert = CERTS.get(id);           // O(1) Map lookup
  if (!cert) return;

  const modal   = document.getElementById('cert-modal');
  const titleEl = document.getElementById('modal-title');
  const imgEl   = document.getElementById('certificate-image');
  if (!modal || !titleEl || !imgEl) return;

  /* Populate */
  titleEl.textContent       = cert.title;
  imgEl.alt                 = cert.title;
  imgEl.dataset.certId      = id;
  imgEl.style.opacity       = '0';
  imgEl.style.transform     = 'scale(1) translate(0,0)';
  ZOOM.current              = 1;

  imgEl.onload = () => {
    imgEl.style.transition = 'opacity .25s ease';
    imgEl.style.opacity    = '1';
  };
  imgEl.onerror = () => {
    imgEl.alt     = 'Certificate image not found.';
    imgEl.style.opacity = '1';
  };
  imgEl.src = cert.src;

  /* Open modal */
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');

  /* Trap focus to modal */
  _trapFocus(modal);
}

/* ══════════════════════════════════════════════════════════════════════
   CLOSE MODAL
══════════════════════════════════════════════════════════════════════ */
function closeCertificateModal() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');

  /* Defer cleanup until after animation */
  setTimeout(() => {
    const img = document.getElementById('certificate-image');
    if (img) { img.src = ''; img.style.opacity = '0'; }
    ZOOM.current = 1;
    DRAG.active  = false;
  }, 380);
}

/* ══════════════════════════════════════════════════════════════════════
   ZOOM  — clamp(value, min, max) avoids branching
══════════════════════════════════════════════════════════════════════ */
function zoomIn()    { ZOOM.current = clamp(ZOOM.current + ZOOM.step, ZOOM.min, ZOOM.max); _applyZoom(); }
function zoomOut()   { ZOOM.current = clamp(ZOOM.current - ZOOM.step, ZOOM.min, ZOOM.max); _applyZoom(); }
function resetZoom() { ZOOM.current = 1; _applyZoom(true); }

/** Math clamp — no branching */
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

function _applyZoom(reset = false) {
  const img = document.getElementById('certificate-image');
  if (!img) return;
  img.style.transition = 'transform .25s ease';
  img.style.transform  = reset
    ? 'scale(1) translate(0,0)'
    : `scale(${ZOOM.current})`;
}

/* ══════════════════════════════════════════════════════════════════════
   SCROLL-TO-ZOOM  (wheel event inside modal)
══════════════════════════════════════════════════════════════════════ */
function _onWheel(e) {
  e.preventDefault();
  if (e.deltaY < 0) zoomIn(); else zoomOut();
}

/* ══════════════════════════════════════════════════════════════════════
   DRAG-TO-PAN
══════════════════════════════════════════════════════════════════════ */
function _onMouseDown(e) {
  if (ZOOM.current <= 1) return;
  DRAG.active = true;
  DRAG.startX = e.clientX - DRAG.lastX;
  DRAG.startY = e.clientY - DRAG.lastY;
  e.currentTarget.style.cursor = 'grabbing';
}

function _onMouseMove(e) {
  if (!DRAG.active) return;
  DRAG.lastX = e.clientX - DRAG.startX;
  DRAG.lastY = e.clientY - DRAG.startY;
  const img = document.getElementById('certificate-image');
  if (img) img.style.transform = `scale(${ZOOM.current}) translate(${DRAG.lastX / ZOOM.current}px, ${DRAG.lastY / ZOOM.current}px)`;
}

function _onMouseUp(e) {
  DRAG.active = false;
  e.currentTarget.style.cursor = ZOOM.current > 1 ? 'grab' : 'default';
}

/* ══════════════════════════════════════════════════════════════════════
   DOWNLOAD & SHARE
══════════════════════════════════════════════════════════════════════ */
function downloadCertificate() {
  const img  = document.getElementById('certificate-image');
  if (!img)  return;
  const cert = CERTS.get(img.dataset.certId);   // O(1)
  if (!cert) return;

  const a = Object.assign(document.createElement('a'), {
    href:     cert.src,
    download: cert.downloadName,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  portfolioManager?.toast?.push('Certificate downloaded! 📄', 'success');
}

function shareContent() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: 'My Certificate', text: 'Check out my certificate!', url });
  } else {
    navigator.clipboard.writeText(url).then(() => {
      portfolioManager?.toast?.push('Link copied to clipboard! 📋', 'info');
    });
  }
}

/* ══════════════════════════════════════════════════════════════════════
   FOCUS TRAP (accessibility)
══════════════════════════════════════════════════════════════════════ */
function _trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  first?.focus();

  modal._focusTrapHandler = function (e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
    }
  };
  modal.addEventListener('keydown', modal._focusTrapHandler);
}

/* ══════════════════════════════════════════════════════════════════════
   EVENT BINDINGS (run after DOM ready)
══════════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const modal    = document.getElementById('cert-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const imgWrap  = document.getElementById('modal-img-wrap');
  const imgEl    = document.getElementById('certificate-image');

  /* Close triggers */
  closeBtn?.addEventListener('click',   closeCertificateModal);
  backdrop?.addEventListener('click',   closeCertificateModal);

  /* Zoom buttons */
  document.getElementById('zoom-in')?.addEventListener('click',    zoomIn);
  document.getElementById('zoom-out')?.addEventListener('click',   zoomOut);
  document.getElementById('zoom-reset')?.addEventListener('click', resetZoom);

  /* Scroll-to-zoom */
  imgWrap?.addEventListener('wheel', _onWheel, { passive: false });

  /* Drag-to-pan */
  imgEl?.addEventListener('mousedown', _onMouseDown);
  imgWrap?.addEventListener('mousemove', _onMouseMove);
  imgWrap?.addEventListener('mouseup',   _onMouseUp);
  imgWrap?.addEventListener('mouseleave', _onMouseUp);

  /* Download / Share */
  document.getElementById('cert-download-btn')?.addEventListener('click', downloadCertificate);
  document.getElementById('cert-share-btn')?.addEventListener('click',    shareContent);

  /* Keyboard ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeCertificateModal();
      /* Remove focus trap handler */
      if (modal._focusTrapHandler) {
        modal.removeEventListener('keydown', modal._focusTrapHandler);
      }
    }
  });
});
