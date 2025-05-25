import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(email !== '' && password !== '');
  }, [email, password]);

  const authenticate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.access) {
        localStorage.setItem('token', data.access);
        console.log('Token received:', data.access);
        retrieveUserDetails(data.access);
        setEmail('');
        setPassword('');
        notyf.success("You are now logged in!");
      } else if (data.message === "Incorrect email or password") {
        notyf.error("Incorrect email or password");
      } else {
        notyf.error(`${email} does not exist`);
      }
    } catch (error) {
      console.error("Login error:", error);
      notyf.error("An error occurred during login.");
    }
  };

  const retrieveUserDetails = async (token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.user) {
        console.log('User details response:', data);
        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName
        });
      } else {
        console.warn("No user data found");
        notyf.error("Failed to retrieve user details.");
      }
    } catch (error) {
      console.error("User details fetch error:", error);
      notyf.error("An error occurred while retrieving user details.");
    }
  };

  if (user.id !== null) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 className="text-center my-5">Log In</h1>
      <Form onSubmit={authenticate}>
        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <hr className="mb-4" />

        <Button
          variant={isActive ? "primary" : "secondary"}
          type="submit"
          id="loginBtn"
          disabled={!isActive}
          className="w-100 mb-3"
        >
          Submit
        </Button>

        <p className="text-center mt-3">
          Don't have an account yet? <Link to="/register">Click here</Link> to register.
        </p>
      </Form>
    </div>
  );
}
