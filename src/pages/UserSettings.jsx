import { useEffect, useRef, useState } from 'react';
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { useAtom } from 'jotai';
import Layout from '../components/Layout';
import { userAtom } from '../utils/useAuth';
import AnimatedDiv from '../components/AnimatedDiv';
import './UserSettings.css';

export default function UserSettings() {
  const [user] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const [methods, setMethods] = useState();

  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const email = user.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);

        setMethods(methods);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProviders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email;
    const newPassword = newPasswordRef.current.value;

    if (!email || !newPassword) {
      return;
    }

    try {
      const hasPasswordProvider = methods.includes('password');
      const currentPassword = currentPasswordRef?.current?.value;

      if (hasPasswordProvider && !currentPassword) {
        return;
      }

      setLoading(true);

      if (hasPasswordProvider) {
        const credential = EmailAuthProvider.credential(email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      await updatePassword(user, newPassword);

      setLoading(false);
      setError();
      setSuccess(true);

      newPasswordRef.current.value = '';
      if (hasPasswordProvider) {
        currentPasswordRef.current.value = '';
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setSuccess(false);
    }
  };

  const emailVerified = user.emailVerified;

  return (
    <Layout>
      <div className="newpassword-area">
        {loading ? (
          <AnimatedDiv className="loading">Updating Password</AnimatedDiv>
        ) : (
          <>
            {error && <AnimatedDiv className="error">{error}</AnimatedDiv>}
            {success && <AnimatedDiv className="success">Updated</AnimatedDiv>}
          </>
        )}

        {!emailVerified && (
          <div className="error">
            Please verify email address. Check your inbox.{' '}
            <a href="/settings">Refresh</a>
          </div>
        )}

        {methods && (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <label>Email</label>
              <input
                type="text"
                autoComplete="email"
                disabled={true}
                value={user.email}
                readOnly
              />
            </div>
            {methods.includes('password') && (
              <div className="row">
                <label>Current Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  ref={currentPasswordRef}
                />
              </div>
            )}
            <div className="row">
              <label>New Password</label>
              <input
                type="password"
                autoComplete="new-password"
                ref={newPasswordRef}
              />
            </div>
            <div className="row">
              <button disabled={loading} type="submit">
                Update password
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
