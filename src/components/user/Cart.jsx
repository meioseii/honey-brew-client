import { useEffect, useState } from "react";
import useCartStore from "../../store/cart-store";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import DeleteProductModal from "./DeleteProductModal";
import useOrderStore from "../../store/order-store";
import useUserStore from "../../store/user-store";
import CheckOutModal from "./CheckOutModal";

const Cart = () => {
  const {
    userCart,
    fetchUserCart,
    updateProductQuantity,
    clearCart,
    isLoading,
  } = useCartStore();
  const { fetchUserProfileData, userProfileData } = useUserStore();
  const { checkOutOrder } = useOrderStore();
  const [modalShow, setModalShow] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const deliveryCharge = 39;

  useEffect(() => {
    fetchUserCart();
    fetchUserProfileData();
  }, []);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setModalShow(true);
  };

  const handleCheckout = async () => {
    try {
      await checkOutOrder();
      clearCart();
      setCheckOutModal(true);
    } catch (error) {
      console.error("Checkout failed:", error);
    }
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
    <Container>
      <DeleteProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        productData={selectedProduct}
      />
      <CheckOutModal
        show={checkOutModal}
        onHide={() => setCheckOutModal(false)}
      />
      <h1 className="text-center my-5 fw-bold">Cart</h1>
      <h4 className="mb-5">Order Details</h4>
      <div className="d-flex flex-column gap-3">
        {userCart.products.length === 0 && (
          <h3 className="text-center">Your cart is empty</h3>
        )}
        {userCart.products.map((item) => (
          <div key={item._id}>
            <Row>
              <Col className="d-flex gap-3">
                <Container className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>{item.name}</h5>
                    <h5>₱{item.price * item.quantity}</h5>
                  </div>
                  <div className="text-muted">{item.brewType || null}</div>
                  <div>
                    <i className="text-muted">{item.size || null}</i>
                  </div>
                </Container>
              </Col>
              <Container className="d-flex justify-content-between align-items-center mt-2">
                <Button
                  className="fw-bold"
                  variant="link"
                  onClick={() => handleDeleteClick(item)}
                >
                  Delete
                </Button>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    className="fw-bold btn-qt"
                    variant="outline-dark"
                    size="sm"
                    disabled={item.quantity <= 1}
                    onClick={() => {
                      updateProductQuantity(item.productId, "deduct");
                    }}
                  >
                    -
                  </Button>
                  <div style={{ width: "30px", textAlign: "center" }}>
                    {item.quantity}
                  </div>
                  <Button
                    className="fw-bold btn-qt"
                    variant="outline-dark"
                    size="sm"
                    onClick={() => {
                      updateProductQuantity(item.productId, "add");
                    }}
                  >
                    +
                  </Button>
                </div>
              </Container>
            </Row>
            <hr></hr>
          </div>
        ))}
        {userCart.products.length > 0 && (
          <Container className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between">
              <div>Subtotal</div>
              <div>₱{userCart.totalPrice?.toFixed(2)}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>Delivery Charge</div>
              <div>₱{deliveryCharge?.toFixed(2)}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="fw-bold">Total</div>
              <div className="fw-bold">
                ₱{(userCart.totalPrice + deliveryCharge).toFixed(2)}
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center gap-3">
              <div>
                <strong>Deliver to: </strong>
                <span>
                  {userProfileData.streetAddress} {userProfileData.villageName}
                </span>
              </div>
              <Button
                className="my-3"
                variant="primary"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </Container>
        )}
      </div>
    </Container>
  );
};

export default Cart;
