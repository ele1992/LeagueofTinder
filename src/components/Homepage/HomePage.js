import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

export default function HomePage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signUp } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function HandleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signUp(emailRef.current.value, passwordRef.current.value);

      setLoading(false);
      history.push("/lolinfo");
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
    <>
      <div className="d-flex align-items-center justify-content-center">
        {/* <img
          style={{
            maxWidth: "100vw",
            zIndex: "-1",
          }}
          src={wallpaper}
          alt="LoL background"
        /> */}
        <Modal show={show} onHide={handleClose} centered>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>

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
                <Form.Group id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                  />
                </Form.Group>
                <Button disabled={loading} type="Submit" className="w-100">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Modal>
        <Button
          size="lg"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            height: "80px",
            width: "220px",
          }}
          onClick={() => {
            handleModal();
          }}
        >
          Sign Up
        </Button>
        <div
          style={{
            position: "fixed",
            left: "0",
            bottom: "0",
            width: "100%",
            backgroundColor: "black",
            padding: "20px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h4>
            "Would I rather be feared or loved? Easy. Both. I want people to be
            afraid of how much they love me." - Michael Scott
          </h4>
        </div>
      </div>
    </>
  );
}
