import { Navigate, Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../utils/useAuth';

export default function PrivateRoutes() {
  const [user] = useAtom(userAtom);

  return user ? <Outlet /> : <Navigate to="/login" />;
}
