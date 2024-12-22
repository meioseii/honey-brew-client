import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import useUserStore from "../../store/user-store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const {
    fetchUserProfileData,
    userProfileData,
    updateUserProfileData,
    message,
  } = useUserStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  useEffect(() => {
    if (userProfileData) {
      reset(userProfileData);
    }
  }, [userProfileData, reset]);

  const handleSubmitForm = (data) => {
    updateUserProfileData(data);
    reset({
      ...userProfileData,
      password: "",
      confirmPassword: "",
    });
  };

  const handleResetForm = () => {
    reset({
      ...userProfileData,
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <Container>
      <h1 className="text-center my-5 fw-bold">Your Profile</h1>
      <Form
        className="container w-75"
        onSubmit={handleSubmit((data) => handleSubmitForm(data))}
      >
        <h4>Your Information</h4>
        <h5 className="mb-5 text-muted">Edit Your Profile</h5>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                {...register("firstName", {
                  required: "First Name is required",
                })}
                type="text"
                className="rounded-0 focus-ring"
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
                type="text"
                className="rounded-0 focus-ring"
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userProfileData?.email || ""}
                className="rounded-0 input-disabled text-muted"
                readOnly
                style={{ cursor: "not-allowed" }}
              />
            </Form.Group>
          </Col>
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
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password", { minLength: 8 })}
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
                  validate: (value) => {
                    if (!password) {
                      return true;
                    }
                    return value === password || "Passwords do not match";
                  },
                })}
                className="rounded-0 focus-ring"
                type="password"
              />
              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button
              variant="primary"
              disabled={!isDirty}
              className="w-100"
              onClick={() => handleResetForm()}
            >
              Reset
            </Button>
          </Col>
          <Col>
            <Button
              variant="primary"
              disabled={!isDirty}
              className="w-100"
              type="submit"
            >
              Save Changes
            </Button>
          </Col>
        </Row>
        {message && (
          <div className="alert alert-primary mt-3" role="alert">
            {message}
          </div>
        )}
      </Form>
    </Container>
  );
};

export default Profile;
