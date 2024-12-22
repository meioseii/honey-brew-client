import {
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import OrdersSideNav from "./OrdersSideNav";
import { useEffect } from "react";
import useOrderStore from "../../store/order-store";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const { fetchAllOrders, allOrders, isLoading, updateOrderStatus } =
    useOrderStore();
  const location = useLocation();
  const currentStatus = new URLSearchParams(location.search).get("status");

  useEffect(() => {
    fetchAllOrders(currentStatus);
  }, [currentStatus, fetchAllOrders]);

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
    return date.toLocaleString("en-US", options);
  };

  const getButtonLabel = (status) => {
    switch (status) {
      case "Confirmed":
        return "Prepare Order";
      case "Preparing":
        return "Deliver Order";
      case "In Transit":
        return "Complete Order";
      case "Completed":
        return "Order Completed";
      default:
        return "Unknown Status";
    }
  };

  const getNextStatus = (status) => {
    switch (status) {
      case "Confirmed":
        return "Preparing";
      case "Preparing":
        return "In Transit";
      case "In Transit":
        return "Completed";
      default:
        return null;
    }
  };

  const filteredOrders = Array.isArray(allOrders)
    ? allOrders.filter((order) => order.status === currentStatus)
    : [];

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
      <h1 className="text-center my-5 fw-bold">Orders</h1>
      <Container className="d-flex gap-5 ">
        <Row className="d-none d-sm-none d-md-none d-lg-block">
          <Col>
            <OrdersSideNav className="" />
          </Col>
        </Row>
        <Container>
          <Row>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Col key={order._id} lg={4} xs={6} className="mb-4">
                  <Card key={order._id} className="mb-3">
                    <Card.Body>
                      <Card.Title>
                        {order.status === "Completed"
                          ? `Completed at ${formatDate(order.updatedAt)}`
                          : formatDate(order.createdAt)}
                      </Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      {order.products.map((product) => (
                        <ListGroup.Item key={product.productId}>
                          {product.brewType} {product.name}{" "}
                          {product.size && product.size} - {product.quantity}x
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    <Button
                      variant="primary"
                      disabled={order.status === "Completed"}
                      onClick={() => {
                        const nextStatus = getNextStatus(order.status);
                        if (nextStatus) {
                          updateOrderStatus(order._id, nextStatus);
                        }
                      }}
                      style={{
                        borderRadius: 0,
                      }}
                    >
                      {getButtonLabel(order.status)}
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <h5 className="">No orders found for this status.</h5>
            )}
          </Row>
        </Container>
      </Container>
    </Container>
  );
};

export default Orders;
