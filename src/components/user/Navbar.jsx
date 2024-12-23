import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import useMenuStore from "../../store/menu-store";
import { useEffect } from "react";
import useAuthenticationStore from "../../store/authentication-store";

const TopNav = () => {
  const { isLoggedIn, isAdmin, handleLogout } = useAuthenticationStore();
  const { fetchMenuCategories, categories } = useMenuStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuCategories();
  }, []);

  return (
    <Navbar expand="lg" sticky="top" className="bg-body-tertiary py-">
      <Container>
        <Navbar.Brand
          as={Link}
          to={isLoggedIn ? "/menu/espresso" : "/"}
          className="fw-bolder fs-2"
        >
          <span className="brand-title">HONEY</span> BREW
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="ms-auto my-2"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {isLoggedIn && !isAdmin && (
              <>
                <Nav.Link as={Link} to={"/cart"}>
                  Cart
                </Nav.Link>
                <Nav.Link as={Link} to={"/profile"}>
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to={"/order-tracker"}>
                  Order Tracker
                </Nav.Link>
              </>
            )}

            {isLoggedIn && isAdmin && (
              <>
                <Nav.Link as={Link} to={"/profile"}>
                  Profile
                </Nav.Link>
                <NavDropdown title="Orders" id="navbarScrollingDropdown">
                  <NavDropdown.Item
                    as={Link}
                    to={`/admin/orders?status=Confirmed`}
                  >
                    Confirmed
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/admin/orders?status=Preparing`}
                  >
                    Preparing
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/admin/orders?status=In%20Transit`}
                  >
                    In Transit
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/admin/orders?status=Completed`}
                  >
                    Completed
                  </NavDropdown.Item>
                </NavDropdown>

                <Nav.Link as={Link} to={"/admin/products"}>
                  Add Product
                </Nav.Link>
              </>
            )}
            <NavDropdown title="Menu" id="navbarScrollingDropdown">
              {categories.map((category) => {
                const categoryPath = `/menu/${category.name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`;

                return (
                  <NavDropdown.Item
                    key={category._id}
                    as={Link}
                    to={categoryPath}
                  >
                    {category.name}
                  </NavDropdown.Item>
                );
              })}
            </NavDropdown>
            {isLoggedIn ? (
              <Nav.Link
                as={Link}
                to={"/"}
                onClick={() => handleLogout(navigate)}
              >
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to={"/"}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
