import { useEffect, useRef, useState } from 'react';
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import AnimatedDiv from '../AnimatedDiv';

export default function UpdatePasswordForm() {
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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email;
    const newPassword = newPasswordRef.current.value;

    const hasPasswordProvider = methods.includes('password');
    const currentPassword = currentPasswordRef?.current?.value;

    if (hasPasswordProvider && !currentPassword) {
      return;
    }

    if (!email || !newPassword) {
      return;
    }

    try {
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
    <form onSubmit={handleChangePassword}>
      {methods?.includes('password') && (
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
      <div className="row bottom">
        <button disabled={loading} type="submit">
          {loading ? 'Loading...' : 'Update Password'}
        </button>

        {loading ? (
          <AnimatedDiv className="result loading">Updating...</AnimatedDiv>
        ) : (
          <>
            {error && (
              <AnimatedDiv className="result error">{error}</AnimatedDiv>
            )}
            {success && (
              <AnimatedDiv className="result success">Updated</AnimatedDiv>
            )}
          </>
        )}
      </div>
    </form>
  );
}
