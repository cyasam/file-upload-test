import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import AnimatedDiv from '../components/AnimatedDiv';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState();

  const handleForgotPassword = useCallback(async (e) => {
    e.preventDefault();

    try {
      const formElements = e.target.elements;
      const email = formElements[0].value;

      if (!email) {
        return;
      }

      setLoading(true);
      setSuccess();
      setError();

      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      setLoading(false);
      setError();
      setSuccess('Password reset email sent!');
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setSuccess();
    }
  }, []);

  return (
    <main className="auth-area">
      <div className="container">
        <div className="login-area">
          <h1>Uploady</h1>
          {error && <AnimatedDiv className="error">{error}</AnimatedDiv>}
          {success && (
            <AnimatedDiv className="success">
              Password reset email sent!
            </AnimatedDiv>
          )}
          <div>
            <p>Please provide your email to reset password.</p>
          </div>
          <form
            method="post"
            className="login-form"
            onSubmit={handleForgotPassword}
          >
            <div className="row">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>
            <div className="row">
              <button disabled={loading} type="submit">
                {loading ? 'Loading' : 'Reset Password'}
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
