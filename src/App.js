// import logo from './logo.svg';
// import './App.css';
import './css/register.css'
import Register from './pages/register';
import Home from './pages/Home';
import Login from './pages/login'
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';
import Lobby from './pages/Lobby';

function App() {
  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to='/login'></Navigate>
    }
    return children
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="room/:roomId" element={<Lobby />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
