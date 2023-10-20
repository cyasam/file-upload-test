import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import AnimatedDiv from './AnimatedDiv';
import './Status.css';

Status.propTypes = {
  status: PropTypes.string,
  percentages: PropTypes.arrayOf(PropTypes.object),
};

export default function Status({ status, percentages }) {
  return (
    <>
      {status === 'uploading' && (
        <>
          {percentages.map(({ value, name, completed }, index) => (
            <div className="uploading-area" key={index}>
              <p className="name">{name}</p>
              <AnimatedDiv className={completed ? 'success' : 'uploading'}>
                <p className="text">
                  {completed ? 'Uploaded' : `Uploading... (${value}%)`}
                </p>
                <motion.div
                  className="percentage"
                  animate={{
                    width: `${value}%`,
                    transition: { duration: 0.8 },
                  }}
                />
              </AnimatedDiv>
            </div>
          ))}
        </>
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
