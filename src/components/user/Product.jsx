import { useEffect, useState } from "react";
import useMenuStore from "../../store/menu-store";
import { useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import useCartStore from "../../store/cart-store";
import AddToCartModal from "./AddToCartModal";

const Product = () => {
  const { fetchMenuProductById, selectedMenuItem, isLoading } = useMenuStore();
  const { id, category } = useParams();
  const { handleAddToCart } = useCartStore();
  const [modalShow, setModalShow] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetchMenuProductById(id, category);
  }, [id, category]);

  const getImageSrc = (imageBuffer) => {
    if (!imageBuffer) {
      return "https://via.placeholder.com/150";
    }
    return `data:image/jpeg;base64,${imageBuffer}`;
  };

  const watchBrewType = watch("brewType");
  const watchSize = watch("size");
  const watchQuantity = watch("quantity", 1);

  useEffect(() => {
    if (selectedMenuItem) {
      if (selectedMenuItem.drinkType === "Frappe") {
        setValue("brewType", "Iced");
      } else if (selectedMenuItem.drinkType === "Coffee") {
        setValue("brewType", "Hot");
      }
    }
  }, [selectedMenuItem, setValue]);

  useEffect(() => {
    if (selectedMenuItem) {
      setPrice(0);

      if (!selectedMenuItem.isDrink) {
        setPrice(selectedMenuItem.price * watchQuantity);
      } else if (watchSize) {
        const selectedVariation = selectedMenuItem.variations.find(
          (variation) => variation._id === watchSize
        );

        if (selectedMenuItem.drinkType === "Frappe") {
          setPrice(selectedVariation.priceIced * watchQuantity);
        } else if (watchBrewType === "Hot") {
          setPrice(selectedVariation.priceHot * watchQuantity);
        } else {
          setPrice(selectedVariation.priceIced * watchQuantity);
        }
      }
    } else {
      setPrice(0);
    }
  }, [selectedMenuItem, watchBrewType, watchSize, watchQuantity]);

  const onSubmit = (data) => {
    const selectedVariation = selectedMenuItem.variations.find(
      (variation) => variation._id === data.size
    );

    const unitPrice = selectedMenuItem.isDrink
      ? selectedMenuItem.drinkType === "Frappe"
        ? selectedVariation.priceIced
        : data.brewType === "Hot"
        ? selectedVariation.priceHot
        : selectedVariation.priceIced
      : selectedMenuItem.price;

    const cartItem = {
      productId: selectedMenuItem._id,
      name: selectedMenuItem.name,
      size: selectedVariation?.size || null,
      brewType: selectedMenuItem.isDrink ? data.brewType : null,
      quantity: parseInt(data.quantity, 10),
      price: unitPrice,
    };

    handleAddToCart(cartItem);
    setModalShow(true);
  };

  if (isLoading || !selectedMenuItem)
    return (
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <h1 className="text-center">Loading...</h1>
      </Container>
    );

  return (
    <Container className="d-flex flex-column align-items-center">
      <AddToCartModal show={modalShow} onHide={() => setModalShow(false)} />
      <Container>
        <Button
          className="d-flex align-items-center gap-3 fs-6 fs-md-6 fs-lg-5 my-3"
          onClick={() => window.history.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
            <h1 className="inline">Back</h1>
          </svg>
          Back
        </Button>
        <hr></hr>
      </Container>
      <Container>
        <Row className="g-4 align-items-center">
          <Col md={12} lg={6} className="d-flex justify-content-center">
            <img
              className="img-fluid fixed-responsive-img"
              src={getImageSrc(selectedMenuItem.image)}
              alt={selectedMenuItem.name}
            />
          </Col>

          <Col xs={12} lg={6}>
            <div>
              <h1>{selectedMenuItem.name}</h1>
              <p className="fs-6 fs-md-6 fs-lg-5">
                {selectedMenuItem.description}
              </p>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {selectedMenuItem.isDrink &&
                  selectedMenuItem.drinkType === "Coffee" && (
                    <Form.Group>
                      <Form.Label className="fs-6 fs-md-6 fs-lg-5">
                        Choose Brew Type:
                      </Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          id="drinkTypeHot"
                          label="Hot"
                          value="Hot"
                          {...register("brewType")}
                        />
                        <Form.Check
                          type="radio"
                          id="drinkTypeIced"
                          label="Iced"
                          value="Iced"
                          {...register("brewType")}
                        />
                      </div>
                    </Form.Group>
                  )}

                {selectedMenuItem.variations.length > 0 && (
                  <Form.Group>
                    <Form.Label className="fs-6 fs-md-6 fs-lg-5">
                      Choose Size:
                    </Form.Label>
                    <div>
                      {selectedMenuItem.variations.map((variation) => {
                        const displayPrice =
                          selectedMenuItem.drinkType === "Frappe"
                            ? variation.priceIced
                            : watchBrewType === "Hot"
                            ? variation.priceHot
                            : variation.priceIced;

                        return (
                          <Form.Check
                            key={variation._id}
                            type="radio"
                            id={`size-${variation._id}`}
                            label={`${variation.size} - ₱${displayPrice}`}
                            value={variation._id}
                            {...register("size", {
                              required: "Please select a size",
                            })}
                          />
                        );
                      })}
                    </div>
                    {errors.size && (
                      <p className="text-danger">{errors.size.message}</p>
                    )}
                  </Form.Group>
                )}

                <Form.Group style={{ width: "50%" }}>
                  <Form.Label className="fs-6 fs-md-6 fs-lg-5 mt-3">
                    Quantity:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    defaultValue="1"
                    {...register("quantity", {
                      required: "Quantity is required",
                      min: { value: 1, message: "Minimum quantity is 1" },
                    })}
                  />
                  {errors.quantity && (
                    <p className="text-danger">{errors.quantity.message}</p>
                  )}
                </Form.Group>

                <h3 className="my-3">Price: ₱{price}</h3>

                <Button variant="primary" className="mb-3" type="submit">
                  Add to Cart
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Product;
