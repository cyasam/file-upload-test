import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoutes from './components/PrivateRoutes';
import UserSettings from './pages/UserSettings';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordChange from './pages/ForgotPasswordChange';
import useAuth from './utils/useAuth';
import Loading from './assets/loading.svg';
import './App.css';
import NotFound from './pages/NotFound';
import AuthAction from './pages/AuthAction';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="main-loading">
        <img src={Loading} alt="loading" />
      </div>
    );
  }

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<UserSettings />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/action" element={<AuthAction />} />
      <Route path="/forgot-password">
        <Route index element={<ForgotPassword />} />
        <Route path="change" element={<ForgotPasswordChange />} />
      </Route>
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
