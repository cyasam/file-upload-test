import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoutes from './components/PrivateRoutes';
import UserSettings from './pages/UserSettings';
import useAuth from './utils/useAuth';
import Loading from './assets/loading.svg';
import './App.css';

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
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
