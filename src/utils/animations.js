export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeOutQuart = [0.25, 1, 0.5, 1];

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

export const fadeUpDelayed = (delay = 0.1) => ({
  ...fadeUp,
  transition: { duration: 0.6, ease: easeOutExpo, delay },
});

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

export const slideLeft = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

export const slideRight = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: easeOutExpo },
};

export const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
  viewport: { once: true, margin: "-50px" },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
};

export const imageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const springTap = {
  whileTap: { scale: 0.95 },
};

export const wordReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: easeOutExpo,
    },
  }),
};

export const charReveal = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.6,
      ease: easeOutExpo,
    },
  }),
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: easeOutExpo },
  },
};
