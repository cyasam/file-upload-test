import PropTypes from 'prop-types';
import LinkIcon from '../assets/link.svg';

FileLink.propTypes = {
  row: PropTypes.object,
};

export default function FileLink({ row }) {
  const url = row.original.url;
  return (
    <div className="link">
      <a target="_blank" rel="noreferrer" href={url} title="Open File">
        <img src={LinkIcon} width={28} height={28} alt="link" />
      </a>
    </div>
  );
}
