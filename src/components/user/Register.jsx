import { Col, Row, Container, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Background from "/home-image.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthenticationStore from "../../store/authentication-store";

const Register = () => {
  const { handleRegister, message } = useAuthenticationStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

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
          onSubmit={handleSubmit((data) => handleRegister(data, navigate))}
        >
          <h2 className="text-center mb-4 fw-bold">Create Account</h2>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  className="rounded-0 focus-ring"
                  type="text"
                />
                {errors.firstName && (
                  <p className="text-danger">{errors.firstName.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  className="rounded-0 focus-ring"
                  type="text"
                />
                {errors.lastName && (
                  <p className="text-danger">{errors.lastName.message}</p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  {...register("email", {
                    required: "Email Address is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="rounded-0 focus-ring"
                  type="email"
                />
                {errors.emailAddress && (
                  <p className="text-danger">{errors.emailAddress.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col xs={0} md={6}></Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  {...register("password", {
                    required: "Password is required",
                    minLength: 8,
                  })}
                  className="rounded-0 focus-ring"
                  type="password"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    minLength: 8,
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="rounded-0 focus-ring"
                  type="password"
                />
                {errors.confirmPassword && (
                  <p className="text-danger">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="streetAddress">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  {...register("streetAddress", {
                    required: "Street Address is required",
                  })}
                  className="rounded-0 focus-ring"
                  type="text"
                />
                {errors.streetAddress && (
                  <p className="text-danger">{errors.streetAddress.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="villageName">
                <Form.Label>Village Name</Form.Label>
                <Form.Control
                  {...register("villageName")}
                  className="rounded-0 focus-ring"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="contactNumber">
                <Form.Label>Contact Number</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="contact-number">+63</InputGroup.Text>
                  <Form.Control
                    {...register("contactNumber", {
                      required: "Contact Number is required",
                      pattern: {
                        value: /^9\d{9}$/,
                        message:
                          "Contact Number must start with 9 and be 10 digits long",
                      },
                    })}
                    className="rounded-0 focus-ring"
                    type="tel"
                    aria-describedby="contact-number"
                  />
                </InputGroup>

                {errors.contactNumber && (
                  <p className="text-danger">{errors.contactNumber.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col xs={0} md={6}></Col>
          </Row>
          <Row>
            <Col>
              <p>
                Already have an account?{" "}
                <span>
                  <Link style={{ color: "#1d2d44", cursor: "pointer" }} to="/">
                    Login
                  </Link>
                </span>
              </p>
            </Col>
          </Row>
          <Button variant="primary" className="w-100" type="submit">
            Submit
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

export default Register;
