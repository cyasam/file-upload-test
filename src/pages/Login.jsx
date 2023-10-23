import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { providerGoogle } from '../firebase';
import { userAtom } from '../utils/useAuth';
import './Login.css';
import AnimatedDiv from '../components/AnimatedDiv';

export default function Login() {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleProviderLogin = () => {
    const auth = getAuth();
    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        const user = result.user;
        setError();

        if (user) {
          navigate('/');
        }
      })
      .catch(() => {
        setError('Authentication Error');
      });
  };

  const handleEmailPasswordLogin = (e) => {
    e.preventDefault();

    const formElements = e.target.elements;
    const email = formElements[0].value;
    const password = formElements[1].value;

    if (!email || !password) {
      return;
    }

    setLoading(true);
    setError();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        setError();

        if (user) {
          navigate('/');
        }
      })
      .catch((error) => {
        setLoading(false);

        const errorCode = error.code;

        if (errorCode === 'auth/wrong-password') {
          setError('Wrong email/password');
        } else {
          setError('Authentication Error');
        }
      });
  };

  return (
    <main className="auth-area">
      <div className="container">
        <div className="login-area">
          <h1>Uploady</h1>
          {error && <AnimatedDiv className="error">{error}</AnimatedDiv>}
          <form className="login-form" onSubmit={handleEmailPasswordLogin}>
            <div className="row">
              <label>Email</label>
              <input type="email" name="email" />
            </div>
            <div className="row">
              <label>Password</label>
              <input type="password" name="password" />
            </div>
            <div className="row">
              <button disabled={loading} type="submit">
                {loading ? 'Loading' : 'Login'}
              </button>
            </div>
          </form>

          <div className="provider-area">
            <button onClick={() => handleProviderLogin()}>
              Sign in with Google
            </button>
          </div>

          <div className="register-area">
            <Link className="button" to="/register">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
