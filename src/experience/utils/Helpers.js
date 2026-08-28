import gsap from "gsap";
/**
 * Collection of helper functions shared across the 3D scenes.
 * Adapted from Eli Parker's MIT-licensed interactive portfolio.
 */

/**
 * Animates the scale of the given refs to create a springy "in" effect.
 * @param {Array} refs - refs to the elements to animate.
 * @returns {Promise<void>} resolves when all animations complete.
 */
export async function animateIn(refs) {
  const animations = refs.map((ref) =>
    gsap.to(ref.current.scale, {
      duration: 0.3,
      x: 1.2,
      y: 1.2,
      z: 1.2,
      ease: "elastic.out(1,0.5)",
    })
  );
  await Promise.all(animations);
}

/**
 * Animates the scale of the given refs back to the resting "out" state.
 * @param {Array} refs - refs to the elements to animate.
 * @returns {Promise<void>} resolves when all animations complete.
 */
export async function animateOut(refs) {
  const animations = refs.map((ref) =>
    gsap.to(ref.current.scale, {
      duration: 0.3,
      x: 1,
      y: 1,
      z: 1,
      ease: "elastic.out(1,0.5)",
    })
  );
  await Promise.all(animations);
}

/**
 * Opens a site in a new tab, with a short cooldown so a link can't be spammed.
 * @param {string} site - URL to open.
 * @param {boolean} recentClick - whether a click happened recently.
 * @param {Function} setRecentClick - setter for the recent-click state.
 */
export async function handleClick(site, recentClick, setRecentClick) {
  if (recentClick) return;
  setRecentClick(true);
  window.open(site, "_blank");
  await new Promise((r) => setTimeout(r, 250));
  setRecentClick(false);
}
