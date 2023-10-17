import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import PrivateRoutes from './components/PrivateRoutes';
import useAuth from './utils/useAuth';

function App() {
  const user = useAuth();

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes user={user} />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
