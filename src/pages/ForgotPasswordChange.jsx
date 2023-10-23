import { useCallback, useEffect, useRef, useState } from 'react';
import {
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode,
} from 'firebase/auth';
import AnimatedDiv from '../components/AnimatedDiv';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ForgotPasswordChange() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState();
  const [searchParams] = useSearchParams();
  const newPasswordRef = useRef();
  const navigate = useNavigate();

  const checkOOBCode = useCallback(async () => {
    try {
      const auth = getAuth();
      const oobCode = searchParams.get('oobCode');

      if (!oobCode) {
        navigate('/login');
        return;
      }

      return await verifyPasswordResetCode(auth, oobCode);
    } catch (error) {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleChangePassword = useCallback(
    async (e) => {
      e.preventDefault();

      const newPassword = newPasswordRef.current.value;

      if (!newPassword) {
        return;
      }

      try {
        setLoading(true);

        const auth = getAuth();
        const oobCode = searchParams.get('oobCode');

        await confirmPasswordReset(auth, oobCode, newPassword);

        setLoading(false);
        setError();
        setSuccess(true);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        setSuccess(false);
      }
    },
    [searchParams, navigate]
  );

  useEffect(() => {
    const checkCode = async () => {
      const email = await checkOOBCode();
      if (!email) {
        navigate('/login');
      }
    };

    checkCode();
  }, [checkOOBCode, navigate]);

  return (
    <main className="auth-area">
      <div className="login-area">
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

        <form onSubmit={handleChangePassword}>
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
              {loading ? 'Loading...' : 'Set New Password'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
