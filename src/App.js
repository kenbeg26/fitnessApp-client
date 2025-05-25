import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import { ToastContainer } from 'react-toastify';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register.js';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Workouts from './pages/Workouts.js';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [user, setUser] = useState({
    id: null,
  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data !== "undefined") {
          console.log("User details received:", data);
          setUser({
            id: data.user._id,
          });
        } else {
          setUser({
            id: null,
          });
        }
      });
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>

      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/logout" element={<Logout />} />

          </Routes>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </Container>
      </Router>

    </UserProvider>
  );
}

export default App;
