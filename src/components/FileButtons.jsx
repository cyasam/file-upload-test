import PropTypes from 'prop-types';

FileButtons.propTypes = {
  status: PropTypes.string,
  paused: PropTypes.bool,
  acceptedFiles: PropTypes.array,
  onStart: PropTypes.func,
  onPauseResume: PropTypes.func,
  onCancel: PropTypes.func,
};

export default function FileButtons({
  status,
  paused,
  acceptedFiles,
  onStart,
  onPauseResume,
  onCancel,
}) {
  return (
    <>
      {status !== 'uploading' && (
        <button
          disabled={acceptedFiles.length === 0 || status === 'success'}
          type="button"
          onClick={onStart}
        >
          Upload
        </button>
      )}

      {status === 'uploading' && (
        <>
          <button type="button" onClick={onPauseResume}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          {paused === false && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </>
      )}
    </>
  );
}
