/* ============================================================
   Audio Manager (BGM & SFX)
   ============================================================ */
const AUDIO = {
    bgm: null,
    sfx: {},
    isMuted: false,
    isPlayingBgm: false
};

function initAudio() {
    if (typeof CONFIG === 'undefined' || !CONFIG.audio) return;

    // Initialize BGM
    if (CONFIG.audio.bgm && CONFIG.audio.bgm.src) {
        AUDIO.bgm = new Audio(CONFIG.audio.bgm.src);
        AUDIO.bgm.loop = CONFIG.audio.bgm.loop !== false;
        AUDIO.bgm.volume = CONFIG.audio.bgm.volume || 0.45;
    }

    // Preload SFX
    if (CONFIG.audio.sfx) {
        Object.entries(CONFIG.audio.sfx).forEach(([name, src]) => {
            const sound = new Audio(src);
            sound.preload = 'auto';
            AUDIO.sfx[name] = sound;
        });
    }

    // Setup Music toggle button
    const musicBtn = document.getElementById('music-toggle-btn');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }
}

function playBgm() {
    if (!AUDIO.bgm) return;
    if (AUDIO.isMuted) return;

    AUDIO.bgm.play().then(() => {
        AUDIO.isPlayingBgm = true;
        updateMusicButtonUI();
    }).catch(err => {
        console.warn('BGM play waiting for user gesture or blocked:', err);
    });
}

function pauseBgm() {
    if (!AUDIO.bgm) return;
    AUDIO.bgm.pause();
    AUDIO.isPlayingBgm = false;
    updateMusicButtonUI();
}

function toggleMusic() {
    if (!AUDIO.bgm) return;
    if (AUDIO.isPlayingBgm) {
        pauseBgm();
        AUDIO.isMuted = true;
    } else {
        AUDIO.isMuted = false;
        playBgm();
    }
    updateMusicButtonUI();
}

function updateMusicButtonUI() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicIcon = document.getElementById('music-icon');
    if (!musicBtn || !musicIcon) return;

    if (AUDIO.isPlayingBgm) {
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('muted');
        musicIcon.textContent = '🎵';
        musicBtn.title = 'ปิดเสียงเพลง';
    } else {
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('muted');
        musicIcon.textContent = '🔇';
        musicBtn.title = 'เปิดเสียงเพลง';
    }
}

function playSfx(name, volume = 0.5) {
    if (AUDIO.isMuted) return;
    const sound = AUDIO.sfx[name];
    if (sound) {
        try {
            sound.currentTime = 0;
            sound.volume = volume;
            sound.play().catch(e => console.warn(`SFX play error (${name}):`, e));
        } catch (e) {
            console.warn(e);
        }
    }
}

function stopSfx(name) {
    const sound = AUDIO.sfx[name];
    if (sound) {
        try {
            sound.pause();
            sound.currentTime = 0;
        } catch (e) {
            console.warn(e);
        }
    }
}

function playRandomClick() {
    const clicks = ['click1', 'click2', 'click3'];
    const chosen = clicks[Math.floor(Math.random() * clicks.length)];
    playSfx(chosen, 0.45);
}

document.addEventListener('DOMContentLoaded', () => {
    // Render text and image from CONFIG
    initContentFromConfig();

    // Initialize Audio
    initAudio();

    /* ---- Slide 1: "Get in" button ---- */
    const btnGetIn = document.getElementById('btn-get-in');
    if (btnGetIn) {
        btnGetIn.addEventListener('click', () => {
            playRandomClick();
            // เล่นเพลง BGM หลังกดปุ่มเปิดดูสิ
            playBgm();

            document.getElementById('tab-slide-2').checked = true;
            Swal.fire({
                title: CONFIG.slide2.welcomeLockAlrt.title,
                text: CONFIG.slide2.welcomeLockAlrt.text,
                confirmButtonText: CONFIG.slide2.welcomeLockAlrt.confirmBtn,
                confirmButtonColor: '#ff758c',
                background: '#fff5f7',
                icon: 'error',
                customClass: {
                    popup: 'note-swal-popup',
                    title: 'note-swal-title'
                }
            });
        });
    }

    /* ---- Slide 3: Mini Envelope Widget → CSS Letter Modal ---- */
    const noteBtn = document.getElementById('s3-note-btn');
    if (noteBtn) {
        noteBtn.addEventListener('click', () => openLetterModal());
        // Keyboard support for div (role=button)
        noteBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLetterModal();
            }
        });
    }

    /* ---- Letter Modal: close button & backdrop click ---- */
    const letterOverlay = document.getElementById('letter-overlay');
    const letterCloseBtn = document.getElementById('letter-close-btn');

    if (letterCloseBtn) {
        letterCloseBtn.addEventListener('click', closeLetterModal);
    }
    if (letterOverlay) {
        letterOverlay.addEventListener('click', (e) => {
            if (e.target === letterOverlay) closeLetterModal();
        });
    }

    /* ---- Letter envelope: click → Phase 2 reading mode ---- */
    const letterValentines = document.getElementById('letter-valentines');
    if (letterValentines) {
        letterValentines.addEventListener('click', () => {
            playSfx('letterOpen', 0.6);
            openReadingCard();
        });
    }

    /* ---- Letter Reading Card: close buttons ---- */
    const readingClose = document.getElementById('letter-reading-close');
    const readingDone = document.getElementById('letter-reading-done');
    if (readingClose) readingClose.addEventListener('click', closeReadingCard);
    if (readingDone) readingDone.addEventListener('click', closeLetterModal);
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
    const cakeTitleEl = document.getElementById('s3-cake-title');
    const cakeSubEl = document.getElementById('s3-cake-subtitle');
    const miniEnvLabel = document.getElementById('s3-mini-env-label');

    if (clickHintEl && CONFIG.slide3.clickHint) clickHintEl.textContent = CONFIG.slide3.clickHint;
    if (miniEnvLabel && CONFIG.slide3.noteBtnText) miniEnvLabel.textContent = CONFIG.slide3.noteBtnText;
    if (cakeTitleEl && CONFIG.slide3.cakeTextTitle) cakeTitleEl.textContent = CONFIG.slide3.cakeTextTitle;
    if (cakeSubEl && CONFIG.slide3.cakeTextSubtitle) cakeSubEl.textContent = CONFIG.slide3.cakeTextSubtitle;

    // Populate letter reading body from CONFIG (Phase 2)
    const readingBody = document.getElementById('letter-reading-body');
    if (readingBody && CONFIG.slide3.noteModal?.htmlContent) {
        readingBody.innerHTML = CONFIG.slide3.noteModal.htmlContent;
    }
}

/* ---- CSS Letter Modal: Open / Close ---- */
function openLetterModal() {
    playSfx('letterOpen', 0.65);

    const overlay = document.getElementById('letter-overlay');
    const valentines = document.getElementById('letter-valentines');
    const hint = document.getElementById('letter-tap-hint');

    // Reset envelope to closed state each time
    if (valentines) valentines.classList.remove('opened');
    if (hint) hint.classList.remove('hidden');

    if (overlay) overlay.classList.add('open');

    // Prevent body scroll while modal open
    document.body.style.overflow = 'hidden';
}

function closeLetterModal() {
    playSfx('click2', 0.4);

    const overlay = document.getElementById('letter-overlay');
    if (!overlay) return;
    // Remove all states
    overlay.classList.remove('open', 'reading');
    document.body.style.overflow = '';
}

/* ---- Phase 2: Open / Close reading card ---- */
function openReadingCard() {
    const overlay = document.getElementById('letter-overlay');
    const hint = document.getElementById('letter-tap-hint');
    if (hint) hint.classList.add('hidden');
    if (overlay) overlay.classList.add('reading');
}

function closeReadingCard() {
    playSfx('click2', 0.4);
    const overlay = document.getElementById('letter-overlay');
    if (overlay) overlay.classList.remove('reading');
    const hint = document.getElementById('letter-tap-hint');
    if (hint) hint.classList.remove('hidden');
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

    // ผูก event listener ผ่าน Event Delegation พร้อมเล่นเสียงคลิก
    dialsContainer.addEventListener('change', () => {
        playRandomClick();
        checkPassword();
    });
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
            playSfx('correct', 0.5);
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

        if (step === 2) {
            playSfx('shaking', 0.6);
        }

        if (step === 4) {
            // หยุดเสียง shaking ทันทีเมื่ออนิเมชั่น giftbox จบ
            stopSfx('shaking');

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
        playSfx('shaking', 0.7);
        if (step === 1) {
            giftbox.removeEventListener('click', openBox);
        }
        openBox();
    }, { once: true });
}

/* ---- Live Counter Interval Reference ---- */
let togetherTimerInterval = null;

/* ---- Thai Grapheme Cluster Splitter ---- */
function getGraphemes(text) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('th', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text), s => s.segment);
    }
    return Array.from(text);
}

/* ---- Calculate Elapsed Time from Start Date (25/12/68 -> 2025-12-25) ---- */
function calculateTogetherTime() {
    const startDateStr = CONFIG.slide3?.startDate || "2025-12-25T00:00:00";
    const start = new Date(startDateStr);
    const now = new Date();
    let diff = now - start;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
}

/* ---- Render Letter-by-Letter Pop-in Animation for Title & Counter ---- */
function startTogetherTitleAnimation(onComplete) {
    const wrapper = document.getElementById('s3-together-wrapper');
    const titleEl = document.getElementById('s3-together-title');
    const counterEl = document.getElementById('s3-together-counter');

    if (!wrapper || !titleEl || !counterEl) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    // แสดงกรอบ wrapper
    wrapper.classList.add('active');

    const prefixText = CONFIG.slide3?.togetherPrefix || "เราอยู่ด้วยกันมาแล้ว 💕";
    const timeData = calculateTogetherTime();
    const counterText = `${timeData.days} วัน ${timeData.hours} ชั่วโมง ${timeData.minutes} นาที ${timeData.seconds} วินาที`;

    const titleGraphemes = getGraphemes(prefixText);
    const counterGraphemes = getGraphemes(counterText);

    const charDelay = 0.04; // 40ms ต่อตัวอักษร
    let delay = 0;

    // เรนเดอร์ตัวอักษรของ title ทีละตัว
    let titleHtml = '';
    titleGraphemes.forEach(char => {
        const displayChar = char === ' ' ? '&nbsp;' : char;
        titleHtml += `<span class="pop-char" style="animation-delay: ${delay.toFixed(3)}s;">${displayChar}</span>`;
        delay += charDelay;
    });
    titleEl.innerHTML = titleHtml;

    // เรนเดอร์ตัวอักษรของ counter ต่อจาก title
    let counterHtml = '';
    counterGraphemes.forEach(char => {
        const displayChar = char === ' ' ? '&nbsp;' : char;
        counterHtml += `<span class="pop-char" style="animation-delay: ${delay.toFixed(3)}s;">${displayChar}</span>`;
        delay += charDelay;
    });
    counterEl.innerHTML = counterHtml;

    // คำนวณเวลาที่ตัวอักษรสุดท้ายผุดขึ้นมาจบ (+ bounce duration 350ms)
    const totalTimeMs = (delay + 0.35) * 1000;

    setTimeout(() => {
        // เมื่อผุดครบแล้ว เริ่ม live counter อัปเดตวินาทีต่อไป
        setupLiveCounter();

        // แจ้งเมื่ออนิเมชั่นตัวอักษรทั้งหมดเสร็จสมบูรณ์
        if (typeof onComplete === 'function') {
            onComplete();
        }
    }, totalTimeMs);
}

/* ---- Setup Live Counter for Real-time Updates ---- */
function setupLiveCounter() {
    const counterEl = document.getElementById('s3-together-counter');
    if (!counterEl) return;

    function updateDisplay() {
        const t = calculateTogetherTime();
        counterEl.innerHTML = `
            <span class="together-unit">${t.days} วัน</span>
            <span class="together-unit">${t.hours} ชั่วโมง</span>
            <span class="together-unit">${t.minutes} นาที</span>
            <span class="together-unit">${t.seconds} วินาที</span>
        `;
    }

    updateDisplay();
    if (togetherTimerInterval) clearInterval(togetherTimerInterval);
    togetherTimerInterval = setInterval(updateDisplay, 1000);
}

/* ---- Show Floating Envelope Widget ---- */
function showEnvelope() {
    const envelope = document.getElementById('s3-note-btn');
    if (envelope) {
        envelope.classList.add('show-envelope');
    }
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

    // รออนิเมชั่นเค้กเสร็จสมบูรณ์ (เค้ก 4.6s + เทียนและไฟตกลงมา ~5.6s)
    // จากนั้นค่อยเริ่มอนิเมชั่นตัวอักษร Title ผุดขึ้นมาทีละตัว
    // และเมื่อตัวอักษรจบ ค่อยแสดงจดหมายที่ลอยอยู่ขวาบนของ cake
    setTimeout(() => {
        startTogetherTitleAnimation(() => {
            showEnvelope();
        });
    }, 5600);
}

