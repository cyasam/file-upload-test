import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoutes from './components/PrivateRoutes';
import UserSettings from './pages/UserSettings';
import useAuth from './utils/useAuth';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<UserSettings />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
