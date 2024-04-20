const animations = {
  appearDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    // transition: { ease: 'easeInOut', duration: 0.75 },
  },
  appearUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    // transition: { ease: 'easeInOut', duration: 0.75 },
  },
  appearUpBounce: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    // transition: { duration: 0.3 },
  },
};

export default animations;
