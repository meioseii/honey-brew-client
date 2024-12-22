import { useEffect } from "react";
import useMenuStore from "../../store/menu-store";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import SideNav from "./SideNav";
import useAuthenticationStore from "../../store/authentication-store";

const Menu = () => {
  const { category } = useParams();
  const { menu, fetchMenuProductsByCategory, isLoading } = useMenuStore();
  const { isLoggedIn, isAdmin } = useAuthenticationStore();

  useEffect(() => {
    fetchMenuProductsByCategory(category);
  }, [category]);

  const getImageSrc = (imageBuffer) => {
    if (!imageBuffer) {
      return "https://via.placeholder.com/150";
    }
    return `data:image/jpeg;base64,${imageBuffer}`;
  };

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
    <Container fluid className="vh-100">
      <Container className="d-flex gap-5 ">
        <Row className="my-5 d-none d-sm-none d-md-none d-lg-block">
          <Col>
            <SideNav className="" />
          </Col>
        </Row>
        {menu.length > 0 ? (
          <Container>
            <Row className="justify-content-start w-100">
              <h1
                className="text-start my-4"
                style={{ textTransform: "capitalize" }}
              >
                {category.replace("-", " ")}
              </h1>
              {menu.map((item) => (
                <Col key={item._id} lg={4} xs={6} className="mb-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={getImageSrc(item.image)}
                      alt={item.name}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <Button
                      as={Link}
                      to={
                        isAdmin
                          ? `/honey-brew-client/#/admin/products/${category}/${item._id}`
                          : isLoggedIn
                          ? `/honey-brew-client/#/menu/${category}/${item._id}`
                          : "/"
                      }
                      variant="primary"
                      style={{
                        borderRadius: 0,
                      }}
                    >
                      <Card.Title className="fs-6 fs-md-4 fs-lg-2">
                        {item.name}
                      </Card.Title>

                      <Card.Text>
                        <span className="fs-6 fs-md-6 fs-lg-5">Starts at </span>
                        <strong className="fs-5 fs-md-3">₱</strong>
                        <span className="fs-6 fs-md-4 fs-lg-3">
                          {item.variations.length > 0
                            ? Math.min(
                                ...item.variations.map((variation) =>
                                  Math.min(
                                    variation.priceHot || variation.priceIced
                                  )
                                )
                              )
                            : item.price}
                        </span>
                        {isAdmin && <div>Edit</div>}
                      </Card.Text>
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        ) : (
          <Container>
            <h3 className="text-center my-5">No menu items found.</h3>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default Menu;
