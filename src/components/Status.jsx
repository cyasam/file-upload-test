import PropTypes from 'prop-types';

Status.propTypes = {
  status: PropTypes.string,
  percentage: PropTypes.number,
};

export default function Status({ status, percentage }) {
  return (
    <>
      <div>{status === 'uploading' && `Uploading... (${percentage}%)`}</div>
      <div>{status === 'success' && 'Uploaded'}</div>
      <div>{status === 'failed' && 'Upload failed'}</div>
      <div>{status === 'canceled' && 'Upload canceled'}</div>
    </>
  );
}
