import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100dvw',
        height: '100dvh',
        flexDirection: 'column',
      }}
    >
      <h1>Page Not Found</h1>
      <Link to="/" className="button">
        Home
      </Link>
    </div>
  );
}
