import { useAtom } from 'jotai';
import { userAtom } from '../utils/useAuth';

export default function UserCard() {
  const [user] = useAtom(userAtom);
  return (
    <div>
      <p>{user.displayName}</p>
      <p>{user.email}</p>
    </div>
  );
}
