import { Col, Row, Container, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Background from "/home-image.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthenticationStore from "../../store/authentication-store";

const Login = () => {
  const { handleLogin, message, isLoading } = useAuthenticationStore();

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  if (isLoading)
    return (
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <Spinner animation="border" />
      </Container>
    );

  return (
    <div className="d-flex justify-items-center align-items-center">
      <div
        className="max-vh-100 d-none d-sm-none d-md-none d-lg-block"
        style={{
          backgroundImage: `url(${Background})`,
          width: "100%",
          height: "100vh",
          backgroundSize: "cover",
        }}
      ></div>
      <Container>
        <Form
          className="container w-75"
          onSubmit={handleSubmit((data) => handleLogin(data, navigate))}
        >
          <h2 className="text-center mb-4 fw-bold">Login</h2>

          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  {...register("email", { required: "Email is required" })}
                  className="rounded-0 focus-ring"
                  type="email"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="rounded-0 focus-ring"
                  type="password"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <p>
                {"Don't have an account? "}
                <span>
                  <Link
                    style={{ color: "#1d2d44", cursor: "pointer" }}
                    to="/register"
                  >
                    Sign up.
                  </Link>
                </span>
              </p>
            </Col>
          </Row>
          <Button variant="primary" className="w-100" type="submit">
            Login
          </Button>
          {message && (
            <div className="alert alert-primary mt-3" role="alert">
              {message}
            </div>
          )}
        </Form>
      </Container>
    </div>
  );
};

export default Login;
