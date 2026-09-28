import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register ScrollToPlugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

/**
 * Smoothly scrolls the window to a target DOM element or selector using GSAP
 * @param targetId - The element ID (without #) or CSS selector
 * @param offset - Vertical offset from the top in pixels (default: 84 to account for sticky header)
 * @param duration - Animation duration in seconds (default: 0.6)
 */
export function smoothScrollTo(targetId: string, offset: number = 84, duration: number = 0.55): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const cleanId = targetId.startsWith('#') ? targetId.slice(1) : targetId;
    const targetElement = document.getElementById(cleanId) || document.querySelector(targetId);

    if (!targetElement) {
      resolve();
      return;
    }

    // Use GSAP ScrollToPlugin for butter-smooth easing
    gsap.to(window, {
      duration,
      scrollTo: {
        y: targetElement,
        offsetY: offset,
        autoKill: true,
      },
      ease: 'power3.out',
      onComplete: () => {
        // Update URL hash without causing a jump
        if (history.pushState) {
          history.pushState(null, '', `#${cleanId}`);
        }
        resolve();
      },
    });
  });
}

/**
 * Smoothly scroll to the top of the page
 */
export function smoothScrollToTop(duration: number = 0.5): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    gsap.to(window, {
      duration,
      scrollTo: { y: 0, autoKill: true },
      ease: 'power3.out',
      onComplete: () => {
        if (history.pushState) {
          history.pushState(null, '', window.location.pathname);
        }
        resolve();
      },
    });
  });
}
