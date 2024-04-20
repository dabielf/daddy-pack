const animations = {
  appearDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { ease: 'easeInOut', duration: 0.75 },
  },
  appearUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { ease: 'easeInOut', duration: 0.75 },
  },
};

export default animations;
