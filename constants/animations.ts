const animations = {
  appearDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    // transition: { ease: 'easeInOut', duration: 0.75 },
  },
  appearUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    // transition: { ease: 'easeInOut', duration: 0.75 },
  },
  appearUpBounce: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    // transition: { duration: 0.3 },
  },
};

export const staggerUp = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerUpDaddies = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.2,
      type: 'spring',
    },
  },
};

export default animations;
