// ======================================================
// Ali Refaat iCloud - Professional Portfolio
// Final Production JavaScript
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==================================================
    // CONFIG
    // ==================================================

    const CONFIG = {
        whatsapp: "201027573851",
        revealThreshold: 0.12,
        navbarOffset: 50,
        topButtonOffset: 500,
        cardGlow: true,
        heroTilt: true,
        counters: true
    };

    // ==================================================
    // HELPERS
    // ==================================================

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    // ==================================================
    // MOTION / DEVICE
    // ==================================================

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const supportsHover = window.matchMedia(
        "(hover: hover)"
    ).matches;

    if (prefersReducedMotion) {
        document.documentElement.style.scrollBehavior = "auto";
    }

    // ==================================================
    // SCROLL REVEAL
    // ==================================================

    const revealElements = $$(
        ".service-card, .project-card, .about-box, " +
        ".support-section, .section-title, .skills span, " +
        ".hero-card, .contact-btn, .final-cta"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    if (
        "IntersectionObserver" in window &&
        !prefersReducedMotion
    ) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: CONFIG.revealThreshold,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });
    }

    // ==================================================
    // NAVBAR
    // ==================================================

    const navbar = $(".navbar");

    const updateNavbar = () => {
        if (!navbar) return;

        const scrolled = window.scrollY > CONFIG.navbarOffset;

        navbar.classList.toggle("scrolled", scrolled);

        if (scrolled) {
            navbar.style.background = "rgba(5, 7, 13, 0.94)";
            navbar.style.boxShadow =
                "0 15px 50px rgba(0, 0, 0, 0.4)";
        } else {
            navbar.style.background = "rgba(8, 11, 18, 0.72)";
            navbar.style.boxShadow =
                "0 20px 60px rgba(0, 0, 0, 0.3)";
        }
    };

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );

    updateNavbar();

    // ==================================================
    // MOBILE MENU
    // ==================================================

    const nav = navbar ? $("nav", navbar) : $("nav");
    const mobileButton = navbar
        ? $(".menu-toggle", navbar)
        : $(".menu-toggle");

    const closeMobileMenu = () => {
        if (!navbar || !mobileButton) return;

        navbar.classList.remove("mobile-open");

        mobileButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileButton.setAttribute(
            "aria-label",
            "فتح القائمة"
        );

        mobileButton.textContent = "☰";
    };

    const toggleMobileMenu = () => {
        if (!navbar || !mobileButton) return;

        const opened = navbar.classList.toggle(
            "mobile-open"
        );

        mobileButton.setAttribute(
            "aria-expanded",
            String(opened)
        );

        mobileButton.setAttribute(
            "aria-label",
            opened ? "إغلاق القائمة" : "فتح القائمة"
        );

        mobileButton.textContent =
            opened ? "×" : "☰";
    };

    if (mobileButton) {
        mobileButton.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
                toggleMobileMenu();
            }
        );
    }

    if (nav) {
        $$("a", nav).forEach((link) => {
            link.addEventListener(
                "click",
                closeMobileMenu
            );
        });
    }

    document.addEventListener("click", (event) => {
        if (
            !navbar ||
            !mobileButton ||
            !navbar.classList.contains("mobile-open")
        ) {
            return;
        }

        if (!navbar.contains(event.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    // ==================================================
    // SMOOTH SCROLL
    // ==================================================

    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            let target;

            try {
                target = document.querySelector(targetId);
            } catch {
                return;
            }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            if (history.pushState) {
                history.pushState(
                    null,
                    "",
                    targetId
                );
            }
        });
    });

    // ==================================================
    // ACTIVE NAVIGATION
    // ==================================================

    const sections = $$("main section[id]");
    const navLinks = $$(".navbar nav a[href^='#']");

    if (
        sections.length &&
        navLinks.length &&
        "IntersectionObserver" in window
    ) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (!visibleSections.length) return;

                const activeId =
                    visibleSections[0].target.id;

                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") ===
                        `#${activeId}`;

                    link.classList.toggle(
                        "active",
                        isActive
                    );

                    if (isActive) {
                        link.setAttribute(
                            "aria-current",
                            "page"
                        );
                    } else {
                        link.removeAttribute(
                            "aria-current"
                        );
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin:
                    "-15% 0px -60% 0px"
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // ==================================================
    // CARD GLOW
    // ==================================================

    const cards = $$(
        ".service-card, .project-card"
    );

    if (
        CONFIG.cardGlow &&
        supportsHover &&
        !prefersReducedMotion
    ) {
        cards.forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                card.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                card.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

                card.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(0, 229, 255, 0.10),
                        rgba(15, 20, 32, 0.72) 48%
                    )
                `;
            });

            card.addEventListener("mouseleave", () => {
                card.style.background =
                    "rgba(15, 20, 32, 0.72)";
            });
        });
    }

    // ==================================================
    // HERO CARD 3D TILT
    // ==================================================

    const heroCard = $(".hero-card");

    if (
        CONFIG.heroTilt &&
        heroCard &&
        supportsHover &&
        !prefersReducedMotion
    ) {
        heroCard.addEventListener(
            "mousemove",
            (event) => {
                const rect =
                    heroCard.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const rotateX =
                    ((y / rect.height) - 0.5) * -8;

                const rotateY =
                    ((x / rect.width) - 0.5) * 8;

                heroCard.style.animation = "none";

                heroCard.style.transform = `
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(1.02)
                `;
            }
        );

        heroCard.addEventListener(
            "mouseleave",
            () => {
                heroCard.style.animation = "";
                heroCard.style.transform =
                    "rotate(2deg)";
            }
        );
    }

    // ==================================================
    // SKILLS HOVER
    // ==================================================

    if (
        supportsHover &&
        !prefersReducedMotion
    ) {
        $$(".skills span").forEach((skill) => {
            skill.addEventListener(
                "mouseenter",
                () => {
                    skill.style.transform =
                        "translateY(-5px) scale(1.04)";
                }
            );

            skill.addEventListener(
                "mouseleave",
                () => {
                    skill.style.transform = "";
                }
            );
        });
    }

    // ==================================================
    // STATS COUNTER
    // ==================================================

    const statNumbers = $$(".stats strong");

    const animateCounter = (element) => {
        if (
            element.dataset.counterDone === "true"
        ) {
            return;
        }

        const original =
            element.textContent.trim();

        const match =
            original.match(/^(\d+)(.*)$/);

        if (!match) return;

        const target =
            parseInt(match[1], 10);

        const suffix =
            match[2] || "";

        element.dataset.counterDone = "true";

        if (
            prefersReducedMotion ||
            !CONFIG.counters ||
            target <= 0
        ) {
            element.textContent =
                target + suffix;

            return;
        }

        const duration = 1200;
        const startTime = performance.now();

        const update = (currentTime) => {
            const progress = Math.min(
                (currentTime - startTime) /
                duration,
                1
            );

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const current =
                Math.floor(
                    target * eased
                );

            element.textContent =
                current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent =
                    target + suffix;
            }
        };

        requestAnimationFrame(update);
    };

    if (
        statNumbers.length &&
        "IntersectionObserver" in window
    ) {
        const statsObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        animateCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.7
                }
            );

        statNumbers.forEach((stat) => {
            statsObserver.observe(stat);
        });
    } else {
        statNumbers.forEach(animateCounter);
    }

    // ==================================================
    // DYNAMIC YEAR
    // ==================================================

    const yearElement = $("#year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

    // ==================================================
    // WHATSAPP
    // ==================================================

    const whatsappUrl =
        `https://wa.me/${CONFIG.whatsapp}`;

    $$('a[href*="wa.me"]').forEach((link) => {
        link.href = whatsappUrl;
        link.target = "_blank";
        link.rel =
            "noopener noreferrer";
    });

    if (!$(".floating-whatsapp")) {
        const whatsappButton =
            document.createElement("a");

        whatsappButton.href =
            whatsappUrl;

        whatsappButton.target =
            "_blank";

        whatsappButton.rel =
            "noopener noreferrer";

        whatsappButton.className =
            "floating-whatsapp";

        whatsappButton.innerHTML = "💬";

        whatsappButton.setAttribute(
            "aria-label",
            "تواصل معي عبر واتساب"
        );

        document.body.appendChild(
            whatsappButton
        );
    }

    // ==================================================
    // BACK TO TOP
    // ==================================================

    let topButton = $(".back-to-top");

    if (!topButton) {
        topButton =
            document.createElement("button");

        topButton.type = "button";
        topButton.className =
            "back-to-top";

        topButton.innerHTML = "↑";

        topButton.setAttribute(
            "aria-label",
            "العودة إلى أعلى الصفحة"
        );

        document.body.appendChild(
            topButton
        );
    }

    const updateTopButton = () => {
        if (
            window.scrollY >
            CONFIG.topButtonOffset
        ) {
            topButton.classList.add("show");
        } else {
            topButton.classList.remove("show");
        }
    };

    window.addEventListener(
        "scroll",
        updateTopButton,
        { passive: true }
    );

    updateTopButton();

    topButton.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });
        }
    );

    // ==================================================
    // IMAGE LIGHTBOX
    // ==================================================

    const lightbox =
        $("#imageLightbox");

    const lightboxImage =
        $("#lightboxImage");

    const lightboxClose =
        $("#lightboxClose");

    const projectImages =
        $$(".project-image img");

    let lastFocusedElement = null;

    if (
        lightbox &&
        lightboxImage &&
        lightboxClose
    ) {
        projectImages.forEach((image) => {
            image.style.cursor =
                "zoom-in";

            image.setAttribute(
                "tabindex",
                "0"
            );

            image.setAttribute(
                "role",
                "button"
            );

            image.setAttribute(
                "aria-label",
                "فتح الصورة بالحجم الكامل"
            );

            const openLightbox = () => {
                lastFocusedElement =
                    document.activeElement;

                lightboxImage.src =
                    image.currentSrc ||
                    image.src;

                lightboxImage.alt =
                    image.alt ||
                    "Preview";

                lightbox.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";

                lightboxClose.focus();
            };

            image.addEventListener(
                "click",
                openLightbox
            );

            image.addEventListener(
                "keydown",
                (event) => {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();
                        openLightbox();
                    }
                }
            );
        });

        const closeLightbox = () => {
            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {
                return;
            }

            lightbox.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

            setTimeout(() => {
                if (
                    !lightbox.classList.contains(
                        "active"
                    )
                ) {
                    lightboxImage.removeAttribute(
                        "src"
                    );
                }
            }, 300);

            if (
                lastFocusedElement &&
                typeof lastFocusedElement.focus ===
                "function"
            ) {
                lastFocusedElement.focus();
            }
        };

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );

        lightbox.addEventListener(
            "click",
            (event) => {
                if (
                    event.target === lightbox
                ) {
                    closeLightbox();
                }
            }
        );

        document.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape" &&
                    lightbox.classList.contains(
                        "active"
                    )
                ) {
                    closeLightbox();
                }
            }
        );
    }

    // ==================================================
    // EXTERNAL LINKS SECURITY
    // ==================================================

    $$('a[target="_blank"]').forEach((link) => {
        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );
    });

    // ==================================================
    // IMAGE ERROR HANDLING
    // ==================================================

    $$("img").forEach((image) => {
        image.addEventListener(
            "error",
            () => {
                image.classList.add(
                    "image-error"
                );

                image.setAttribute(
                    "data-image-error",
                    "true"
                );
            }
        );
    });

    // ==================================================
    // BUTTON CLICK EFFECT
    // ==================================================

    $$(".btn, .contact-btn").forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                button.classList.add(
                    "clicked"
                );

                setTimeout(() => {
                    button.classList.remove(
                        "clicked"
                    );
                }, 250);
            }
        );
    });

    // ==================================================
    // RESIZE HANDLING
    // ==================================================

    let resizeTimer = null;

    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                if (
                    window.innerWidth > 900
                ) {
                    closeMobileMenu();
                }
            }, 150);
        },
        { passive: true }
    );

    // ==================================================
    // PAGE READY
    // ==================================================

    document.documentElement.classList.add(
        "js-loaded"
    );

    // ==================================================
    // CONSOLE
    // ==================================================

    console.log(
        "%c Ali Refaat iCloud ",
        "background:#00e5ff;" +
        "color:#05070d;" +
        "font-size:18px;" +
        "font-weight:bold;" +
        "padding:8px;"
    );

    console.log(
        "Portfolio initialized successfully 🚀"
    );
});