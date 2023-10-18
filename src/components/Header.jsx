import UserCard from './UserCard';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header>
      <h1>
        <Link to="/">Uploady</Link>
      </h1>
      <UserCard />
    </header>
  );
}
