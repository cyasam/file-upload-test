import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import AnimatedDiv from '../components/AnimatedDiv';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCreateNewAccount = useCallback(async (e) => {
    e.preventDefault();

    try {
      const formElements = e.target.elements;
      const name = formElements[0].value;
      const email = formElements[1].value;
      const password = formElements[2].value;
      const confirmPassword = formElements[3].value;

      if (!name || !email || !password || !confirmPassword) {
        return;
      }

      if (password !== confirmPassword) {
        setError('Password not matched');
        return;
      }

      setLoading(true);
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user) {
        return;
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      await sendEmailVerification(auth.currentUser);

      window.location.href = '/';
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, []);

  return (
    <main className="auth-area">
      <div className="container">
        <div className="login-area">
          <h1>Uploady</h1>
          {error && <AnimatedDiv className="error">{error}</AnimatedDiv>}
          <form
            method="post"
            className="login-form"
            onSubmit={handleCreateNewAccount}
          >
            <div className="row">
              <label>Name</label>
              <input type="text" name="name" required />
            </div>
            <div className="row">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>
            <div className="row">
              <label>Password</label>
              <input type="password" name="password" required />
            </div>
            <div className="row">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" required />
            </div>
            <div className="row">
              <button disabled={loading} type="submit">
                {loading ? 'Loading' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="register-area">
            <Link className="button" to="/login">
              Login Existing Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
