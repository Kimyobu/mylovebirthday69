/* ============================================================
   Birthday App - Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Render text and image from CONFIG
    initContentFromConfig();

    /* ---- Slide 1: "Get in" button ---- */
    const btnGetIn = document.getElementById('btn-get-in');
    if (btnGetIn) {
        btnGetIn.addEventListener('click', () => {
            document.getElementById('tab-slide-2').checked = true;
            Swal.fire({
                title: CONFIG.slide2.welcomeLockAlrt.title,
                text: CONFIG.slide2.welcomeLockAlrt.text,
                confirmButtonText: CONFIG.slide2.welcomeLockAlrt.confirmBtn,
                confirmButtonColor: '#ff758c',
                background: '#fff5f7',
                customClass: {
                    popup: 'note-swal-popup',
                    title: 'note-swal-title'
                }
            });
        });
    }

    /* ---- Slide 3: Note Paper Button → SweetAlert2 Modal ---- */
    const noteBtn = document.getElementById('s3-note-btn');
    if (noteBtn) {
        noteBtn.addEventListener('click', () => {
            Swal.fire({
                title: CONFIG.slide3.noteModal.title,
                html: CONFIG.slide3.noteModal.htmlContent,
                showConfirmButton: true,
                confirmButtonText: CONFIG.slide3.noteModal.confirmBtn,
                confirmButtonColor: '#ff758c',
                background: '#fff5f7',
                customClass: {
                    popup: 'note-swal-popup',
                    title: 'note-swal-title'
                }
            });
        });
    }
});

/* ---- Render Content Dynamic from CONFIG ---- */
function initContentFromConfig() {
    if (typeof CONFIG === 'undefined') return;

    // Slide 1
    const imgEl = document.getElementById('s1-img');
    const titleEl = document.getElementById('s1-title');
    const subtitleEl = document.getElementById('s1-subtitle');
    const btnTextEl = document.getElementById('s1-btn-text');

    if (imgEl && CONFIG.slide1.image) imgEl.src = CONFIG.slide1.image;
    if (titleEl && CONFIG.slide1.title) titleEl.textContent = CONFIG.slide1.title;
    if (subtitleEl && CONFIG.slide1.subtitle) subtitleEl.textContent = CONFIG.slide1.subtitle;
    if (btnTextEl && CONFIG.slide1.btnText) btnTextEl.textContent = CONFIG.slide1.btnText;

    // Slide 2
    const lockTitleEl = document.getElementById('s2-lock-title');
    if (lockTitleEl && CONFIG.slide2.lockTitle) lockTitleEl.textContent = CONFIG.slide2.lockTitle;
    renderDials();

    // Slide 3
    const clickHintEl = document.getElementById('s3-click-hint');
    const noteBtnEl = document.getElementById('s3-note-btn');
    const cakeTitleEl = document.getElementById('s3-cake-title');
    const cakeSubEl = document.getElementById('s3-cake-subtitle');

    if (clickHintEl && CONFIG.slide3.clickHint) clickHintEl.textContent = CONFIG.slide3.clickHint;
    if (noteBtnEl && CONFIG.slide3.noteBtnText) noteBtnEl.textContent = CONFIG.slide3.noteBtnText;
    if (cakeTitleEl && CONFIG.slide3.cakeTextTitle) cakeTitleEl.textContent = CONFIG.slide3.cakeTextTitle;
    if (cakeSubEl && CONFIG.slide3.cakeTextSubtitle) cakeSubEl.textContent = CONFIG.slide3.cakeTextSubtitle;
}

/* ---- Render Combination Lock Dials Dynamically ---- */
function renderDials() {
    const dialsContainer = document.getElementById('lock-dials');
    if (!dialsContainer || typeof CONFIG === 'undefined') return;

    const passcode = String(CONFIG.slide2.passcode || "356200");
    const length = passcode.length;

    // Render HTML สำหรับ dial แต่ละอัน
    let html = '';
    for (let i = 1; i <= length; i++) {
        html += `<div class="dial"><div class="nonagon">`;
        for (let num = 0; num <= 9; num++) {
            const isChecked = (num === 0) ? ' checked=""' : '';
            html += `
                <div class="face face-${num}">
                    <input type="radio" name="wheel-${i}" class="radio radio-${num}"${isChecked} />
                    <span>${num}</span>
                </div>`;
        }
        html += `</div></div>`;
    }
    dialsContainer.innerHTML = html;

    // ผูก event listener ผ่าน Event Delegation
    dialsContainer.addEventListener('change', checkPassword);
}

/* ---- Slide 2: Passcode Check ---- */
function checkPassword() {
    if (typeof CONFIG === 'undefined') return;

    const passcode = String(CONFIG.slide2.passcode || "356200");
    const digits = passcode.split('');

    // ตรวจสอบว่าทุกหลักตรงกับตัวเลขใน passcode หรือไม่
    const isCorrect = digits.every((digit, index) => {
        const wheelNum = index + 1;
        const checkedRadio = document.querySelector(`input[name="wheel-${wheelNum}"]:checked`);
        return checkedRadio?.classList.contains(`radio-${digit}`);
    });

    if (isCorrect) {
        setTimeout(() => {
            Swal.fire({
                title: CONFIG.slide2.successAlert.title,
                text: CONFIG.slide2.successAlert.text,
                icon: 'success',
                confirmButtonText: CONFIG.slide2.successAlert.confirmBtn,
                confirmButtonColor: '#ff758c'
            }).then(res => {
                if (res.isConfirmed) {
                    document.getElementById('tab-slide-3').checked = true;
                    // Small delay then start giftbox wobble
                    setTimeout(initGiftbox, 600);
                }
            });
        }, 400);
    }
}

/* ---- Slide 3: Giftbox Opening System ---- */
let giftboxInited = false;

function initGiftbox() {
    if (giftboxInited) return;
    giftboxInited = true;

    const scene = document.getElementById('merrywrap');
    const giftbox = document.getElementById('s3-giftbox');
    const reveal = document.getElementById('s3-reveal');

    if (!scene || !giftbox) return;

    let step = 1;
    const stepDurations = [2000, 800, 600, 500]; // ms per step

    function setStepClass(n) {
        scene.className = 'surprise-scene step-' + n;
    }

    function openBox() {
        setStepClass(step);

        if (step === 4) {
            // Show reveal content
            if (reveal) {
                reveal.classList.add('active');
            }
            // Trigger SVG cake SMIL animation
            triggerCakeAnimation();
            return;
        }

        setTimeout(openBox, stepDurations[step - 1]);
        step++;
    }

    // Start wobble immediately
    setStepClass(1);
    giftbox.addEventListener('click', () => {
        if (step === 1) {
            giftbox.removeEventListener('click', openBox);
        }
        openBox();
    }, { once: true });
}

/* ---- Cake SVG SMIL animation trigger ---- */
function triggerCakeAnimation() {
    const firstAnimate = document.getElementById('s3_bizcocho_1');
    if (firstAnimate) {
        try {
            firstAnimate.beginElement();
        } catch (e) {
            console.warn('SMIL beginElement not supported:', e);
        }
    }

    const velas = document.querySelector('.s3-velas');
    if (velas) {
        setTimeout(() => {
            velas.classList.add('drop-in');
        }, 5000);
    }
}

