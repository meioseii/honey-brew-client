import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useCartStore from "../../store/cart-store";
import { Link } from "react-router-dom";

const CheckOutModal = (props) => {
  const { productData } = useCartStore();
  return (
    <Modal
      {...props}
      backdrop="static"
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="text-center"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <h5 className="fw-bolder">Checkout Successful!</h5>
        <div className="fw-light">Thank you for ordering!</div>

        <div className="d-flex justify-content-around mt-3">
          <Button as={Link} to={`/order-tracker`} onClick={props.onHide}>
            Track Order
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CheckOutModal;
