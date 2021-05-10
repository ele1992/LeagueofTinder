import React, { useState, useRef } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { ArrowRightSquare } from "react-bootstrap-icons";
import Logo from "../../images/Logo.png";
import invertedLogo from "../../images/invertedLogo.png";
import { useAuth } from "../../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { currentUser, currentPlayerInfo, logOut, logIn } = useAuth();

  async function handleLogOut() {
    try {
      await logOut();
      history.push("/");
    } catch {
      console.log("Failed to log out");
    }
  }

  async function HandleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await logIn(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push("/dash");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  function handleModal() {
    setShow(true);
  }
  function handleClose() {
    setShow(false);
  }
  return (
    <div className="Navbar_Container">
      <Link to="/dash">
        <img
          className="Navbar_Logo"
          src={Logo}
          onMouseOver={(e) => {
            e.currentTarget.src = invertedLogo;
          }}
          onMouseOut={(e) => {
            e.currentTarget.src = Logo;
          }}
          alt="logo"
        />
      </Link>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <h2>Sign In</h2>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={HandleSubmit}>
            <Form.Group id="email">
              <Form.Control
                placeholder="email"
                size="lg"
                type="email"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Control
                size="lg"
                placeholder="password"
                type="password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Button
              disabled={loading}
              type="Submit"
              className="w-100"
              onClick={() => {
                handleClose();
              }}
              variant="link"
            >
              <ArrowRightSquare className="arrowIcon" size={60} />
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {!currentPlayerInfo ? (
        <h2>League of Tinder</h2>
      ) : (
        <h2>{currentPlayerInfo.summonerName}</h2>
      )}
      {!currentUser ? (
        <Button className="Navbar_SignIn_Button" onClick={handleModal}>
          Sign In
        </Button>
      ) : (
        <Button
          className="Navbar_SignOut_Button"
          variant="dark"
          onClick={handleLogOut}
        >
          Sign Out
        </Button>
      )}
    </div>
  );
}
