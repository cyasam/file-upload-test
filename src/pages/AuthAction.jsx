import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthAction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const queryString = searchParams.toString();

    if (!mode) {
      navigate('/login');
    }

    if (mode === 'resetPassword') {
      const url = `/forgot-password/change?${queryString}`;
      navigate(url);
    }
  }, [navigate, searchParams]);

  return <div></div>;
}
