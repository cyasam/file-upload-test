import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { getAuth, signOut } from 'firebase/auth';
import { userAtom } from '../utils/useAuth';
import { Link } from 'react-router-dom';

export default function UserCard() {
  const [user] = useAtom(userAtom);
  const [open, setOpen] = useState(false);
  const userAreaRef = useRef();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      const element = userAreaRef.current;
      if (e.target !== element && !element.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="user-card">
      <div ref={userAreaRef} className="user-area">
        <img
          className="photo"
          src={user.photoURL}
          width={48}
          height={48}
          alt={user.displayName}
          onClick={handleOpen}
        />
        {open && (
          <div className="user">
            <p>{user.displayName}</p>
            <p>{user.email}</p>
            <Link className="link" to="/settings">
              Settings
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
