import { useEffect, useRef, useState } from 'react';
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import Layout from '../components/Layout';
import { userAtom } from '../utils/useAuth';
import { useAtom } from 'jotai';

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

  return (
    <Layout>
      {loading ? (
        <div>Updating Password</div>
      ) : (
        <>
          {error && <div>{error}</div>}
          {success && <div>Updated</div>}
        </>
      )}

      {methods && (
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label>Email</label>
            <input type="text" disabled={true} value={user.email} />
          </div>
          {methods.includes('password') && (
            <div className="row">
              <label>Current Password</label>
              <input type="password" ref={currentPasswordRef} />
            </div>
          )}
          <div className="row">
            <label>New Password</label>
            <input type="password" ref={newPasswordRef} />
          </div>
          <div className="row">
            <button disabled={loading} type="submit">
              Update password
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
}
