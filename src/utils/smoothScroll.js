/**
 * Custom smooth scroll with speed-ramp easing (slow → fast → slow).
 * Uses requestAnimationFrame for buttery 60fps animation.
 */

// Ease-in-out cubic: slow start, fast middle, slow end
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Scroll to a target element with speed-ramp animation.
 * @param {string} selector  — CSS selector (e.g. '#contact')
 * @param {number} offset    — px to subtract from top (for fixed navbar)
 * @param {number} duration  — animation duration in ms (default 1200)
 */
export function smoothScrollTo(selector, offset = 80, duration = 1200) {
    const el = document.querySelector(selector);
    if (!el) return;

    const startY = window.scrollY;
    const targetY = el.getBoundingClientRect().top + startY - offset;
    const distance = targetY - startY;

    // Skip animation for tiny distances
    if (Math.abs(distance) < 5) return;

    // Scale duration based on scroll distance for natural feel
    // Short scrolls are faster, long scrolls get more time
    const scaledDuration = Math.min(
        Math.max(duration * (Math.abs(distance) / 2000), 600),
        1800
    );

    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / scaledDuration, 1);

        const easedProgress = easeInOutCubic(progress);
        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}
