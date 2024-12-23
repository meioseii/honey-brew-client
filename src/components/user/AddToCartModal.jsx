import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useCartStore from "../../store/cart-store";
import { Link } from "react-router-dom";

const AddToCartModal = (props) => {
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
        <h5 className="fw-bolder">You just added:</h5>
        <div className="fw-light">{productData.name}</div>
        <div className="text-muted">
          {productData.brewType} - <i>{productData.size}</i>
        </div>
        <p className="fw-bold">₱{productData.price * productData.quantity}</p>
        <div className="d-flex justify-content-around">
          <Button as={Link} to={`/menu/espresso`} onClick={props.onHide}>
            Order More
          </Button>
          <Button as={Link} to={`/cart`} onClick={props.onHide}>
            Check Out
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddToCartModal;
