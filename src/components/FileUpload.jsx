import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import PropTypes from 'prop-types';

FileUpload.propTypes = {
  disabled: PropTypes.bool,
  onDrop: PropTypes.func,
};

export default function FileUpload({ disabled, onDrop }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop,
  });

  return (
    <div
      {...getRootProps({
        className: classNames('dropzone', { disabled: disabled }),
      })}
    >
      <input {...getInputProps()} />
      <p>Drag n drop some files here, or click to select files</p>
      {acceptedFiles.map((file, index) => (
        <p key={index}>{file.name}</p>
      ))}
    </div>
  );
}
