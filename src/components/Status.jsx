import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import AnimatedDiv from './AnimatedDiv';
import './Status.css';

Status.propTypes = {
  status: PropTypes.string,
  percentage: PropTypes.number,
};

export default function Status({ status, percentage }) {
  return (
    <>
      {status === 'uploading' && (
        <AnimatedDiv className="uploading">
          <p className="text">{`Uploading... (${percentage}%)`}</p>
          <motion.div
            className="percentage"
            animate={{
              width: `${percentage}%`,
              transition: { duration: 0.8 },
            }}
          />
        </AnimatedDiv>
      )}
      {status === 'success' && (
        <AnimatedDiv className="success">Uploaded</AnimatedDiv>
      )}
      {status === 'failed' && (
        <AnimatedDiv className="error">Upload failed</AnimatedDiv>
      )}
      {status === 'canceled' && (
        <AnimatedDiv className="error">Upload canceled</AnimatedDiv>
      )}
    </>
  );
}
