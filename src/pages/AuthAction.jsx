import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthAction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const queryString = searchParams.toString();

    if (mode === 'resetPassword') {
      const url = `/forgot-password/change?${queryString}`;
      navigate(url);
    } else if (mode === 'verifyEmail') {
      const url = `/verify-email?${queryString}`;
      navigate(url);
    } else {
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return <div></div>;
}
