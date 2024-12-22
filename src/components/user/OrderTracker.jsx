import {
  Accordion,
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import useOrderStore from "../../store/order-store";
import { useEffect } from "react";
import useUserStore from "../../store/user-store";

const OrderTracker = () => {
  const { userOrders, fetchOrders } = useOrderStore();
  const { fetchUserProfileData, userProfileData, isLoading } = useUserStore();

  useEffect(() => {
    fetchOrders();
    fetchUserProfileData();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(dateString);
    return date
      .toLocaleString("en-US", options)
      .replace(",", "")
      .replace(/:\d{2}$/, (match) => match.toLowerCase());
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

  if (!userOrders?.length) {
    return (
      <>
        <h1 className="text-center my-5 fw-bold">Order Tracker</h1>
        <div className="d-flex flex-column gap-3">
          {userOrders.products.length === 0 && (
            <h3 className="text-center">No orders found</h3>
          )}
        </div>
      </>
    );
  }

  return (
    <Container>
      <h1 className="text-center my-5 fw-bold">Order Tracker</h1>

      <Accordion className="mb-5">
        {userOrders?.map((order, index) => (
          <Accordion.Item eventKey={index.toString()} key={order._id}>
            <Accordion.Header>
              {formatDate(order.createdAt)} | {order.status}
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-column gap-3">
                {order.products.map((item) => (
                  <Row key={item.productId}>
                    <Col className="d-flex gap-3">
                      <Container className="w-100">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5>{item.name}</h5>
                          <h5>₱{item.price * item.quantity}</h5>
                        </div>
                        <div className="text-muted">
                          {item.brewType || null}
                        </div>
                        <div>
                          <i className="text-muted">{item.size || null}</i>
                        </div>
                      </Container>
                    </Col>
                  </Row>
                ))}
              </div>
              <hr />
              <Container className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <div>Subtotal</div>
                  <div>₱{order.totalPrice.toFixed(2)}</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>Delivery Charge</div>
                  <div>₱39.00</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="fw-bold">Total</div>
                  <div className="fw-bold">
                    ₱{(order.totalPrice + 39).toFixed(2)}
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
                  <div>
                    <strong>Deliver to: </strong>
                    <span>
                      {userProfileData.streetAddress}{" "}
                      {userProfileData.villageName}
                    </span>{" "}
                    {/* Replace with the actual address if available */}
                  </div>
                </div>
              </Container>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default OrderTracker;
