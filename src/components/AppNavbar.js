import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import '../index.css';

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  console.log('Current user:', user);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Workout Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>

            {/* Show these only when user is logged in */}
            {user.id !== null && (
              <>
                <Nav.Link as={NavLink} to="/workouts">Workouts</Nav.Link>
                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
              </>
            )}

            {/* Show these only when user is NOT logged in */}
            {user.id === null && (
              <>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}