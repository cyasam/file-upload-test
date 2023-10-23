import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Header from './Header';

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <Header />
      <AnimatePresence>
        <motion.main
          className="main-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">{children}</div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
