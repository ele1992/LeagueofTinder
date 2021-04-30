import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/Logo.png";
import invertedLogo from "../images/invertedLogo.png";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";
import { ArrowRightSquare } from "react-bootstrap-icons";

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
        alignItems: "center",
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
      {!currentPlayerInfo ? null : (
        <h2 style={{ color: "white" }}>{currentPlayerInfo.summonerName}</h2>
      )}
      {!currentUser ? (
        <Button
          className="logInButton"
          onClick={handleModal}
          style={{
            width: "100px",
            height: "60px",
          }}
        >
          Sign In
        </Button>
      ) : (
        <Button
          className="logOutButton"
          variant="dark"
          onClick={handleLogOut}
          style={{ width: "100px", height: "60px" }}
        >
          Sign Out
        </Button>
      )}
    </div>
  );
}
