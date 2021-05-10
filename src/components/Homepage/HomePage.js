import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Footer/Footer";
import "./HomePage.css";

export default function HomePage() {
  const { signUp } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
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
      <div className="HomePage_Container">
        <Modal show={show} onHide={handleClose} centered>
          <Card>
            <Card.Body>
              <h2 className="Modal_SignUp_Title">Sign Up</h2>

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
                <Button
                  disabled={loading}
                  type="Submit"
                  className="Modal_SignUp_Button"
                >
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Modal>
        <Button
          className="HomePage_SignUp_Button"
          size="lg"
          onClick={() => {
            handleModal();
          }}
        >
          Sign Up
        </Button>
        <Footer />
      </div>
    </>
  );
}
