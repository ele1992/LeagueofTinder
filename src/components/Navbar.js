import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/Logo.png";
import invertedLogo from "../images/invertedLogo.png";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div
      style={{
        backgroundColor: "black",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Link to="/dash">
        <img
          style={{ height: "70px" }}
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <h2 className="text-center mb-4">Log In</h2>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={HandleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button
              disabled={loading}
              type="Submit"
              className="w-100"
              onClick={() => {
                handleClose();
              }}
            >
              Log In
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {!currentPlayerInfo ? null : (
        <h2 style={{ color: "white", display: "flex", alignItems: "center" }}>
          {currentPlayerInfo.summonerName}
        </h2>
      )}
      {!currentUser ? (
        <Button variant="dark" onClick={handleModal}>
          Log In
        </Button>
      ) : (
        <Button variant="dark" onClick={handleLogOut}>
          Log Out
        </Button>
      )}
    </div>
  );
}
