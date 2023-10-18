import PropTypes from 'prop-types';
import './Status.css';

Status.propTypes = {
  status: PropTypes.string,
  percentage: PropTypes.number,
};

export default function Status({ status, percentage }) {
  return (
    <>
      {status === 'uploading' && (
        <div className="uploading">
          <p className="text">{`Uploading... (${percentage}%)`}</p>
          <div className="percentage" style={{ width: `${percentage}%` }}></div>
        </div>
      )}
      {status === 'success' && <div className="success">Uploaded</div>}
      {status === 'failed' && <div className="error">Upload failed</div>}
      {status === 'canceled' && <div className="error">Upload canceled</div>}
    </>
  );
}
