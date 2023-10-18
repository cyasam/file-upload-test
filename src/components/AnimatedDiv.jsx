import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const initial = {
  opacity: 0,
};

const animate = {
  opacity: 1,
};

AnimatedDiv.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default function AnimatedDiv({ className, children }) {
  return (
    <motion.div
      variants={{
        initial,
        animate,
      }}
      initial={initial}
      animate={animate}
      className={className}
    >
      {children}
    </motion.div>
  );
}
