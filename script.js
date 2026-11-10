// ======================================================
// KLYVORA — CINEMATIC 3D WEBSITE
// Three.js + GSAP + ScrollTrigger + Lenis
// ======================================================

import * as THREE from "three";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// ======================================================
// 01. SMOOTH SCROLL
// ======================================================

let lenis;

if (!reducedMotion) {
    lenis = new Lenis({
        duration: 1.25,
        smoothWheel: true,
        smoothTouch: false
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}


// ======================================================
// 02. PRELOADER
// ======================================================

function initLoader() {
    const loader = document.querySelector("#loader");

    if (!loader) return;

    window.addEventListener("load", () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            onComplete: () => {
                loader.style.display = "none";
                ScrollTrigger.refresh();
            }
        });
    });
}


// ======================================================
// 03. NAVBAR
// ======================================================

function initNavbar() {
    const header = document.querySelector("#header");

    if (!header) return;

    function update() {
        header.classList.toggle(
            "scrolled",
            window.scrollY > 50
        );
    }

    window.addEventListener("scroll", update, {
        passive: true
    });

    update();
}


// ======================================================
// 04. MOBILE MENU
// ======================================================

function initMobileMenu() {
    const toggle = document.querySelector("#menuToggle");
    const nav = document.querySelector("#navLinks");

    if (!toggle || !nav) return;

    function closeMenu() {
        nav.classList.remove("active", "open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
        const open = !nav.classList.contains("active");

        nav.classList.toggle("active", open);
        nav.classList.toggle("open", open);
        toggle.classList.toggle("active", open);

        toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            !nav.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            closeMenu();
        }
    });
}


// ======================================================
// 05. SMOOTH NAVIGATION LINKS
// ======================================================

function initNavigationLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {
            const selector = link.getAttribute("href");

            if (!selector || selector === "#") return;

            const target = document.querySelector(selector);

            if (!target) return;

            event.preventDefault();

            if (lenis && !reducedMotion) {
                lenis.scrollTo(target, {
                    offset: -75,
                    duration: 1.2
                });
            } else {
                target.scrollIntoView({
                    behavior: reducedMotion ? "instant" : "smooth"
                });
            }
        });
    });
}


// ======================================================
// 06. HERO INTRO ANIMATION
// ======================================================

function initHeroAnimation() {
    const hero = document.querySelector(".hero");

    if (!hero || reducedMotion) return;

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    timeline
        .from(".hero-label", {
            opacity: 0,
            y: 25,
            duration: 0.8
        })
        .from(".hero h1", {
            opacity: 0,
            y: 70,
            duration: 1.1
        }, "-=0.4")
        .from(".hero-description", {
            opacity: 0,
            y: 25,
            duration: 0.8
        }, "-=0.5")
        .from(".hero-buttons .btn", {
            opacity: 0,
            y: 25,
            stagger: 0.15,
            duration: 0.7
        }, "-=0.4")
        .from(".hero-bottom", {
            opacity: 0,
            duration: 0.7
        }, "-=0.2");
}


// ======================================================
// 07. SCROLL SIDE ANIMATIONS
// ======================================================

function initSideScrollReveal() {

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    gsap.utils.toArray("section:not(#home)").forEach((section, sectionIndex) => {

        const elements = Array.from(section.children).filter(element => {
            return !element.classList.contains("side-reveal");
        });

        elements.forEach((element, elementIndex) => {

            const direction =
                (sectionIndex + elementIndex) % 2 === 0 ? -100 : 100;

            gsap.fromTo(
                element,
                {
                    x: direction,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        end: "top 45%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

        });

    });

    gsap.utils.toArray(".service-card").forEach((card, index) => {

        gsap.fromTo(card,
            {
                x: index % 2 === 0 ? -80 : 80,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );

    });

    gsap.utils.toArray(".process-item").forEach((item, index) => {

        gsap.fromTo(item,
            {
                x: index % 2 === 0 ? -90 : 90,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );

    });

    gsap.utils.toArray(".why-card").forEach((card, index) => {

        gsap.fromTo(card,
            {
                y: 70,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none reverse"
                }
            }
        );

    });

    ScrollTrigger.refresh();
}


// ======================================================
// 08. ABOUT TEXT REVEAL
// ======================================================

function initAboutAnimation() {

    if (reducedMotion) return;

    const about = document.querySelector(".about");

    if (!about) return;

    const elements = about.querySelectorAll(
        ".about-content p, .about-highlight span"
    );

    gsap.from(elements, {
        opacity: 0,
        y: 35,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: about,
            start: "top 65%",
            once: true
        }
    });
}


// ======================================================
// ======================================================
// 09. CTA ANIMATION
// ======================================================

function initCTAAnimation() {

    const cta = document.querySelector(".cta");

    if (!cta || reducedMotion) return;

    gsap.from(cta.querySelectorAll(
        ".cta-label, h2, p, .btn"
    ), {
        opacity: 0,
        y: 45,
        stagger: 0.18,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: cta,
            start: "top 75%",
            once: true
        }
    });
}


// ======================================================
// 10. CONTACT ANIMATION
// ======================================================

function initContactAnimation() {

    const contact = document.querySelector(".contact");

    if (!contact || reducedMotion) return;

    gsap.from(contact.querySelectorAll(
        ".contact-links a, .founder-card"
    ), {
        opacity: 0,
        y: 45,
        stagger: 0.17,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: contact,
            start: "top 75%",
            once: true
        }
    });
}


// ======================================================
// 11. ABOUT VIDEO SLIDESHOW
// ======================================================

function initAboutVideoSlideshow() {

    const aboutVideos = document.querySelectorAll(
        ".about-video-background video"
    );

    if (!aboutVideos.length) return;

    let activeVideo = 0;

    function playVideo(video) {
        video.play().catch((error) => {
            console.warn("KLYVORA: About background video could not play.", error);
        });
    }

    aboutVideos.forEach((video, index) => {
        video.pause();
        video.classList.remove("is-active");

        if (index === 0) {
            video.currentTime = 0;
            video.classList.add("is-active");
            playVideo(video);
        }
    });

    if (reducedMotion) return;

    window.setInterval(() => {
        const previousVideo = aboutVideos[activeVideo];

        activeVideo = (activeVideo + 1) % aboutVideos.length;

        const nextVideo = aboutVideos[activeVideo];

        nextVideo.currentTime = 0;
        playVideo(nextVideo);

        nextVideo.classList.add("is-active");
        previousVideo.classList.remove("is-active");

        window.setTimeout(() => {
            previousVideo.pause();
        }, 2200);

    }, 8000);
}


// ======================================================
// 12. 3D AI NEURAL UNIVERSE
// ======================================================

function initAIUniverse() {

    const canvas = document.querySelector("#ai-world-canvas");

    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.z = 12;

    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
    } catch (error) {
        console.error("AI universe renderer unavailable:", error);
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const aiGroup = new THREE.Group();
    scene.add(aiGroup);

    scene.add(new THREE.AmbientLight(0x7777ff, 1.5));

    const purpleLight = new THREE.PointLight(0x792cff, 8, 30);
    purpleLight.position.set(3, 3, 5);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x176bff, 7, 30);
    blueLight.position.set(-4, -3, 4);
    scene.add(blueLight);

    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.65, 3),
        new THREE.MeshStandardMaterial({
            color: 0x24105c,
            emissive: 0x4510bb,
            emissiveIntensity: 1.5,
            metalness: 0.7,
            roughness: 0.25
        })
    );
    aiGroup.add(core);

    const wireCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.72, 2),
        new THREE.MeshBasicMaterial({
            color: 0x9d70ff,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        })
    );
    aiGroup.add(wireCore);

    const rings = [];

    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(2.3 + i * 0.38, 0.012, 8, 120),
            new THREE.MeshBasicMaterial({
                color: i === 1 ? 0x2585ff : 0x9b55ff,
                transparent: true,
                opacity: 0.65
            })
        );

        ring.rotation.x = Math.PI / 2.5 + i * 0.65;
        ring.rotation.y = i * 0.8;
        aiGroup.add(ring);
        rings.push(ring);
    }

    const particleCount = 130;
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 13,
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 5
        );
    }

    const particles = new THREE.Points(
        new THREE.BufferGeometry().setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        ),
        new THREE.PointsMaterial({
            color: 0x9a72ff,
            size: 0.045,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        })
    );
    scene.add(particles);

    const linePositions = [];

    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < 2.1) {
                linePositions.push(
                    positions[i * 3],
                    positions[i * 3 + 1],
                    positions[i * 3 + 2],
                    positions[j * 3],
                    positions[j * 3 + 1],
                    positions[j * 3 + 2]
                );
            }
        }
    }

    const neuralLines = new THREE.LineSegments(
        new THREE.BufferGeometry().setAttribute(
            "position",
            new THREE.Float32BufferAttribute(linePositions, 3)
        ),
        new THREE.LineBasicMaterial({
            color: 0x6136c9,
            transparent: true,
            opacity: 0.22
        })
    );
    scene.add(neuralLines);

    let mouseX = 0;
    let mouseY = 0;
    let scrollProgress = 0;

    if (!reducedMotion) {
        window.addEventListener("mousemove", (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
        });

        window.addEventListener("scroll", () => {
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        }, { passive: true });
    }

    const clock = new THREE.Clock();

    function animate() {

        if (!reducedMotion) {
            requestAnimationFrame(animate);

            const time = clock.getElapsedTime();

            core.rotation.y = time * 0.18;
            core.rotation.x = Math.sin(time * 0.3) * 0.15;

            wireCore.rotation.y = -time * 0.12;
            wireCore.rotation.x = time * 0.08;

            rings.forEach((ring, index) => {
                ring.rotation.z += 0.002 * (index + 1);
                ring.rotation.x += 0.0008;
            });

            aiGroup.rotation.y += (mouseX - aiGroup.rotation.y) * 0.015;
            aiGroup.rotation.x += (-mouseY - aiGroup.rotation.x) * 0.015;
            aiGroup.rotation.z = scrollProgress * Math.PI * 1.5;
            aiGroup.scale.setScalar(1 + scrollProgress * 0.25);

            particles.rotation.y = time * 0.025;
            particles.rotation.x = Math.sin(time * 0.2) * 0.08;

            purpleLight.intensity = 7 + Math.sin(time * 1.5) * 2;
            blueLight.intensity = 6 + Math.cos(time * 1.2) * 2;
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    });
}


// ======================================================
// 13. THREE.JS — 3D SCENE
// ======================================================

function initThreeScene() {

    const container = document.querySelector(".hero-visual");

    if (!container) {
        console.warn("KLYVORA: Hero visual container missing.");
        return;
    }

    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: !isMobile
        });
    } catch (error) {
        console.error("3D renderer unavailable:", error);
        return;
    }

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const canvas = renderer.domElement;
    canvas.id = "klyvora-3d-canvas";

    container.prepend(canvas);


    // SCENE

    const scene = new THREE.Scene();


    // CAMERA

    const camera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 7);


    // LIGHTING

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));

    const purpleLight = new THREE.PointLight(
        0x913cff,
        45,
        20
    );

    purpleLight.position.set(3, 3, 4);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(
        0x326bff,
        35,
        20
    );

    blueLight.position.set(-4, -2, 3);
    scene.add(blueLight);


    // MAIN OBJECT GROUP

    const group = new THREE.Group();
    scene.add(group);


    // MAIN CRYSTAL

    const crystal = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 2),
        new THREE.MeshPhysicalMaterial({
            color: 0x8d5bff,
            metalness: 0.7,
            roughness: 0.17,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
            emissive: 0x280052,
            emissiveIntensity: 0.4
        })
    );

    group.add(crystal);


    // INNER CORE

    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55, 2),
        new THREE.MeshPhysicalMaterial({
            color: 0x5730c9,
            metalness: 0.55,
            roughness: 0.12,
            emissive: 0x703cff,
            emissiveIntensity: 1.2
        })
    );

    group.add(core);


    // RINGS

    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xb28aff,
        metalness: 0.9,
        roughness: 0.18,
        emissive: 0x5620aa,
        emissiveIntensity: 0.8
    });

    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(1.9, 0.018, 12, 120),
        ringMaterial
    );

    ring1.rotation.x = Math.PI / 2.5;
    group.add(ring1);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.2, 0.012, 12, 120),
        ringMaterial.clone()
    );

    ring2.material.color.set(0x527bff);
    ring2.rotation.y = Math.PI / 2.5;
    group.add(ring2);

    const ring3 = new THREE.Mesh(
        new THREE.TorusGeometry(1.65, 0.012, 12, 120),
        ringMaterial.clone()
    );

    ring3.rotation.x = Math.PI / 1.5;
    group.add(ring3);


    // FLOATING PARTICLES

    const count = isMobile ? 250 : 650;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xa98aff,
        size: 0.018,
        transparent: true,
        opacity: 0.75
    });

    const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
    );

    scene.add(particles);


    // SCROLL-BASED 3D ANIMATION

    if (!reducedMotion) {

        const heroTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#home",
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            }
        });

        heroTimeline
            .to(group.rotation, {
                y: Math.PI * 1.5,
                x: Math.PI / 4,
                ease: "none"
            }, 0)
            .to(group.scale, {
                x: 1.3,
                y: 1.3,
                z: 1.3,
                ease: "none"
            }, 0)
            .to(camera.position, {
                z: 4.7,
                ease: "none"
            }, 0)
            .to(ring1.rotation, {
                z: Math.PI,
                ease: "none"
            }, 0);
    }


    // MOUSE MOVEMENT

    let mouseX = 0;
    let mouseY = 0;

    if (!isMobile && !reducedMotion) {
        window.addEventListener("mousemove", (event) => {
            mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
        });
    }


    // RESIZE

    const resizeObserver = new ResizeObserver(() => {

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    });

    resizeObserver.observe(container);


    // ANIMATION LOOP

    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {

        const time = clock.getElapsedTime();

        if (!reducedMotion) {

            crystal.rotation.x = time * 0.12;
            crystal.rotation.y = time * 0.2;

            core.rotation.y = -time * 0.3;

            ring1.rotation.z += 0.001;
            ring2.rotation.x += 0.0008;
            ring3.rotation.y += 0.001;

            group.rotation.x +=
                (mouseY - group.rotation.x) * 0.01;

            group.rotation.y +=
                (mouseX - group.rotation.y) * 0.01;

            particles.rotation.y = time * 0.012;
        }

        renderer.render(scene, camera);

    });

    console.log("KLYVORA 3D scene initialized.");
}


// ======================================================
// 14. MAGNETIC BUTTONS
// ======================================================

function initMagneticButtons() {

    if (isMobile || reducedMotion) return;

    document.querySelectorAll(".btn").forEach((button) => {

        button.addEventListener("mousemove", (event) => {

            const rect = button.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3
            });

        });

        button.addEventListener("mouseleave", () => {

            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.4)"
            });

        });

    });
}


// ======================================================
// 15. ACTIVE NAVIGATION
// ======================================================

function initActiveNavigation() {

    const sections = document.querySelectorAll(
        "#home, #about, #services, #process, #why, #contact"
    );

    const links = document.querySelectorAll("#navLinks a");

    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            links.forEach((link) => {

                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );

            });

        });

    }, {
        rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach((section) => observer.observe(section));
}


// ======================================================
// 16. FOOTER YEAR
// ======================================================

function initFooter() {

    const year = document.querySelector("#year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {

        backToTop.addEventListener("click", (event) => {

            event.preventDefault();

            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

        });

    }
}


// ======================================================
// 17. INITIALIZE EVERYTHING
// ======================================================

function initKlyvora() {

    console.log(
        "%c KLYVORA ",
        "background:#873df0;color:white;padding:12px;font-size:20px;font-weight:bold;"
    );

    initLoader();
    initNavbar();
    initMobileMenu();
    initNavigationLinks();

    initHeroAnimation();

    initSideScrollReveal();
    initAboutAnimation();
    initAboutVideoSlideshow();
    initCTAAnimation();
    initContactAnimation();

    initAIUniverse();
    initThreeScene();

    initMagneticButtons();
    initActiveNavigation();
    initFooter();

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    console.log("KLYVORA website ready 🚀");
}


// START

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initKlyvora,
        { once: true }
    );

} else {

    initKlyvora();

}