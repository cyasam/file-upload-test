import { getAuth, signInWithPopup } from 'firebase/auth';
import { provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../utils/useAuth';

export default function Login() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        if (user) {
          navigate('/');
        }
      })
      .catch((/* error */) => {
        /* // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error); */
      });
  };
  return (
    <main>
      <button onClick={handleLogin}>Login with Google</button>
    </main>
  );
}
