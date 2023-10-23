import { getAuth, checkActionCode, applyActionCode } from 'firebase/auth';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedDiv from '../components/AnimatedDiv';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkOOBCode = useCallback(
    async (auth, oobCode) => {
      try {
        if (!oobCode) {
          navigate('/login');
          return;
        }

        return await checkActionCode(auth, oobCode);
      } catch (error) {
        navigate('/login');
      }
    },
    [navigate]
  );

  useEffect(() => {
    const checkCode = async () => {
      try {
        const auth = getAuth();
        const oobCode = searchParams.get('oobCode');

        const metadata = await checkOOBCode(auth, oobCode);
        if (!metadata) {
          navigate('/login');
          return;
        }

        await applyActionCode(auth, oobCode);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        navigate('/login');
      }
    };

    checkCode();
  }, [checkOOBCode, navigate, searchParams]);

  return (
    <main className="auth-area">
      <div className="container">
        <div className="login-area">
          <AnimatedDiv className="success">Email verified.</AnimatedDiv>
        </div>
      </div>
    </main>
  );
}
