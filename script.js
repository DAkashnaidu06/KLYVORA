
/* =========================================
   KLYVORA — PREMIUM INTERACTIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. PRELOADER
    ===================================== */

    const loader = document.getElementById("loader");

    function hideLoader() {
        if (loader) {
            loader.classList.add("hidden");
        }
    }

    window.addEventListener("load", hideLoader);

    // Safety fallback if a resource takes too long
    setTimeout(hideLoader, 3000);


    /* =====================================
       2. NAVBAR SCROLL EFFECT
    ===================================== */

    const navbar = document.getElementById("navbar");

    function updateNavbar() {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbar);
    updateNavbar();


    /* =====================================
       3. MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navigationItems = document.querySelectorAll(".nav-links a");

    function closeMobileMenu() {
        if (!menuToggle || !navLinks) return;

        menuToggle.classList.remove("active");
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && navLinks) {

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));

        });

        navigationItems.forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", (event) => {

            const clickedInsideMenu = navLinks.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }

        });

    }


    /* =====================================
       4. SMOOTH SCROLL
    ===================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function(event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================
       5. SCROLL REVEAL ANIMATIONS
    ===================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================
       6. CUSTOM CURSOR
    ===================================== */

    const cursorDot = document.getElementById("cursorDot");
    const cursorOutline = document.getElementById("cursorOutline");

    const desktopPointer = window.matchMedia("(pointer: fine)").matches;

    if (cursorDot && cursorOutline && desktopPointer) {

        let mouseX = 0;
        let mouseY = 0;

        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

        });

        function animateCursor() {

            outlineX += (mouseX - outlineX) * 0.16;
            outlineY += (mouseY - outlineY) * 0.16;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);

        }

        animateCursor();

        const interactiveElements = document.querySelectorAll(
            "a, button, .service-card, .work-card"
        );

        interactiveElements.forEach(element => {

            element.addEventListener("mouseenter", () => {

                cursorOutline.style.width = "55px";
                cursorOutline.style.height = "55px";

            });

            element.addEventListener("mouseleave", () => {

                cursorOutline.style.width = "35px";
                cursorOutline.style.height = "35px";

            });

        });

    }


    /* =====================================
       7. MOUSE REACTIVE HERO VISUAL
    ===================================== */

    const heroVisual = document.querySelector(".hero-visual");
    const heroSphere = document.querySelector(".hero-sphere");

    if (heroVisual && heroSphere && desktopPointer) {

        heroVisual.addEventListener("mousemove", (event) => {

            const rect = heroVisual.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * 25;
            const rotateX = (0.5 - y) * 25;

            heroSphere.style.transform =
                `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });

        heroVisual.addEventListener("mouseleave", () => {

            heroSphere.style.transform = "";

        });

    }


    /* =====================================
       8. MAGNETIC BUTTON EFFECT
    ===================================== */

    const magneticButtons = document.querySelectorAll(
        ".button, .nav-cta"
    );

    if (desktopPointer) {

        magneticButtons.forEach(button => {

            button.addEventListener("mousemove", (event) => {

                const rect = button.getBoundingClientRect();

                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                button.style.transform =
                    `translate(${x * 0.08}px, ${y * 0.12}px)`;

            });

            button.addEventListener("mouseleave", () => {

                button.style.transform = "";

            });

        });

    }


    /* =====================================
       9. ACTIVE NAVIGATION ON SCROLL
    ===================================== */

    const pageSections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navigationItems.forEach(link => {

                    const linkTarget = link.getAttribute("href");

                    link.classList.toggle(
                        "active",
                        linkTarget === `#${currentId}`
                    );

                });

            });

        }, {
            rootMargin: "-35% 0px -55% 0px"
        });

        pageSections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* =====================================
       10. FOOTER YEAR
    ===================================== */

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =====================================
       11. REDUCED MOTION SUPPORT
    ===================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================
       12. PAGE READY
    ===================================== */

    document.body.classList.add("page-ready");

    console.log(
        "%c KLYVORA ",
        "background: linear-gradient(90deg,#9565ff,#477bff); color:white; font-size:20px; font-weight:bold; padding:10px 20px;"
    );

    console.log(
        "Your Vision. Our Creation. — Digital experiences beyond limits."
    );

});