/**
 * Kyrgyz Wedding Invitation - Main JavaScript
 * Fixed & Optimized Version
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LANGUAGE SWITCHING
    // ==========================================

    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-ru][data-ky]');
    const placeholderElements = document.querySelectorAll('[data-placeholder-ru][data-placeholder-ky]');

    let currentLang = localStorage.getItem('weddingLang') || 'ru';

    function switchLanguage(lang) {

        currentLang = lang;

        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        translatableElements.forEach(el => {

            if (el.dataset[lang]) {
                el.textContent = el.dataset[lang];
            }

        });

        placeholderElements.forEach(el => {

            const key =
                'placeholder' +
                lang.charAt(0).toUpperCase() +
                lang.slice(1);

            if (el.dataset[key]) {
                el.placeholder = el.dataset[key];
            }

        });

        document.documentElement.lang = lang;

        localStorage.setItem('weddingLang', lang);
    }

    langBtns.forEach(btn => {

        btn.addEventListener('click', () => {

            const lang = btn.dataset.lang;

            if (lang !== currentLang) {
                switchLanguage(lang);
            }

        });

    });

    switchLanguage(currentLang);

    // ==========================================
    // COUNTDOWN TIMER
    // ==========================================

    const weddingDate =
        new Date('2026-08-28T17:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {

        if (
            !daysEl ||
            !hoursEl ||
            !minutesEl ||
            !secondsEl
        ) {
            return;
        }

        const now = Date.now();

        const distance = weddingDate - now;

        if (distance <= 0) {

            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';

            return;
        }

        const days = Math.floor(
            distance / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (
                distance %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (
                distance %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (
                distance %
                (1000 * 60)
            ) / 1000
        );

        daysEl.textContent =
            String(days).padStart(2, '0');

        hoursEl.textContent =
            String(hours).padStart(2, '0');

        minutesEl.textContent =
            String(minutes).padStart(2, '0');

        secondsEl.textContent =
            String(seconds).padStart(2, '0');
    }

    updateCountdown();

    setInterval(updateCountdown, 1000);

    // ==========================================
    // GUEST COUNTER
    // ==========================================

    const decreaseBtn =
        document.getElementById('decreaseGuests');

    const increaseBtn =
        document.getElementById('increaseGuests');

    const guestCountInput =
        document.getElementById('guestCount');

    if (
        decreaseBtn &&
        increaseBtn &&
        guestCountInput
    ) {

        decreaseBtn.addEventListener('click', () => {

            let current =
                parseInt(guestCountInput.value) || 1;

            if (current > 1) {
                guestCountInput.value = current - 1;
            }

        });

        increaseBtn.addEventListener('click', () => {

            let current =
                parseInt(guestCountInput.value) || 1;

            if (current < 10) {
                guestCountInput.value = current + 1;
            }

        });

    }

    // ==========================================
    // RSVP FORM
    // ==========================================

    const rsvpForm =
        document.getElementById('rsvpForm');

    const rsvpSuccess =
        document.getElementById('rsvpSuccess');

    if (rsvpForm) {

        rsvpForm.addEventListener(
            'submit',
            async (e) => {

                e.preventDefault();

                const formData = {

                    name:
                        document
                            .getElementById('guestName')
                            ?.value
                            .trim() || '',

                    phone:
                        document
                            .getElementById('guestPhone')
                            ?.value
                            .trim() || '',

                    guestCount:
                        parseInt(
                            document
                                .getElementById('guestCount')
                                ?.value
                        ) || 1,

                    willAttend:
                        document
                            .getElementById('willAttend')
                            ?.checked || false,

                    dietary:
                        document
                            .getElementById('dietary')
                            ?.value
                            .trim() || '',

                    submittedAt:
                        new Date().toISOString(),

                    language:
                        currentLang
                };

                if (
                    !formData.name ||
                    !formData.phone
                ) {

                    alert(
                        currentLang === 'ru'
                            ? 'Пожалуйста, заполните обязательные поля.'
                            : 'Сураныч, милдеттүү талааларды толтуруңуз.'
                    );

                    return;
                }

                const submitBtn =
                    rsvpForm.querySelector('.submit-btn');

                if (!submitBtn) {
                    return;
                }

                const originalText =
                    submitBtn.textContent;

                submitBtn.disabled = true;

                submitBtn.textContent =
                    currentLang === 'ru'
                        ? 'Отправка...'
                        : 'Жөнөтүлүүдө...';

                try {

                    saveToLocalStorage(formData);

                    rsvpForm.style.display = 'none';

                    if (rsvpSuccess) {

                        rsvpSuccess.classList.remove('hidden');

                        rsvpSuccess.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });

                    }

                } catch (error) {

                    console.error(error);

                    alert(
                        currentLang === 'ru'
                            ? 'Ошибка отправки.'
                            : 'Жөнөтүүдө ката кетти.'
                    );

                } finally {

                    submitBtn.disabled = false;

                    submitBtn.textContent =
                        originalText;
                }

            }
        );
    }

    // ==========================================
    // SAVE TO LOCAL STORAGE
    // ==========================================

    function saveToLocalStorage(data) {

        const existing =
            JSON.parse(
                localStorage.getItem('weddingRSVPs')
            ) || [];

        existing.push(data);

        localStorage.setItem(
            'weddingRSVPs',
            JSON.stringify(existing)
        );
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(anchor => {

            anchor.addEventListener(
                'click',
                function (e) {

                    e.preventDefault();

                    const target =
                        document.querySelector(
                            this.getAttribute('href')
                        );

                    if (target) {

                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                    }

                }
            );

        });

    // ==========================================
    // SCROLL ANIMATION
    // ==========================================

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            'visible'
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.1
            }
        );

    document
        .querySelectorAll('section')
        .forEach(section => {

            section.classList.add(
                'fade-section'
            );

            observer.observe(section);

        });

    // ==========================================
    // PARALLAX HERO
    // ==========================================

    const heroContent =
        document.querySelector('.hero-content');

    let ticking = false;

    function updateParallax() {

        const scrolled = window.scrollY;

        if (
            heroContent &&
            scrolled < window.innerHeight
        ) {

            heroContent.style.transform =
                'translateY(' +
                (scrolled * 0.2) +
                'px)';
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {

        if (!ticking) {

            window.requestAnimationFrame(
                updateParallax
            );

            ticking = true;
        }

    });

});
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set } from "https://adil-elena-wedding-default-rtdb.asia-southeast1.firebasedatabase.app/";

const firebaseConfig = {
  apiKey: "AIzaSyB-_HaznK1UM1EahQgDO-XdO_eBL4Dlots",
  authDomain: "adil-elena-wedding.firebaseapp.com",
  projectId: "adil-elena-wedding",
  storageBucket: "adil-elena-wedding.firebasestorage.app",
  messagingSenderId: "911079053624",
  appId: "1:911079053624:web:91b48a3308c2b5e96289cd",
  measurementId: "G-JMCRHEMPCH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("rsvpForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const guests = document.getElementById("guests").value;

  const newGuestRef = push(ref(db, "guests"));

  set(newGuestRef, {
    name: name,
    guests: Number(guests),
    createdAt: Date.now()
  });

  alert("Спасибо! Вы записаны 🙌");
  form.reset();
});