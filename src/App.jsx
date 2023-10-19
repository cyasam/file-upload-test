import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoutes from './components/PrivateRoutes';
import UserSettings from './pages/UserSettings';
import useAuth from './utils/useAuth';
import './App.css';

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<UserSettings />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
