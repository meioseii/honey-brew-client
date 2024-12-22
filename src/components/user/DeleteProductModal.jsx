import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useCartStore from "../../store/cart-store";

const DeleteProductModal = ({ show, onHide, productData }) => {
  const { handleDeleteProduct } = useCartStore();

  const handleDelete = () => {
    handleDeleteProduct(productData.productId);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="text-center"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <h5 className="fw-bolder">
          Are you sure you want to delete this item?
        </h5>
        {productData && (
          <>
            <div className="fw-light">{productData.name}</div>
            <div className="text-muted">
              {productData.brewType} - <i>{productData.size}</i>
            </div>
          </>
        )}
        <div className="d-flex justify-content-center gap-3 mt-3">
          <Button variant="secondary" className="px-5" onClick={onHide}>
            No
          </Button>
          <Button variant="danger" className="px-5" onClick={handleDelete}>
            Yes
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteProductModal;
