import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMenuStore from "../../store/menu-store";

const UpdateProduct = () => {
  const {
    fetchMenuProductById,
    selectedMenuItem,
    isLoading,
    categories,
    fetchMenuCategories,
    updateMenuProduct,
    deleteMenuProduct,
    message,
  } = useMenuStore();
  const { id, category } = useParams();
  const [variations, setVariations] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const isDrink = watch("isDrink") === "true";
  const drinkType = watch("drinkType");

  useEffect(() => {
    const loadProduct = async () => {
      await fetchMenuProductById(id, category);
    };
    loadProduct();
  }, [id, category]);

  useEffect(() => {
    if (selectedMenuItem) {
      const defaultValues = {
        name: selectedMenuItem.name || "",
        description: selectedMenuItem.description || "",
        category: selectedMenuItem.category?.map((cat) => cat.name) || [],
        isDrink: selectedMenuItem.isDrink ? "true" : "false",
        drinkType: selectedMenuItem.drinkType || "",
      };
      reset(defaultValues);
      setVariations(selectedMenuItem.variations || []);
    }
  }, [selectedMenuItem, reset]);

  const onSubmit = async (data) => {
    const isDrink = data.isDrink === "true";

    const fileToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

    try {
      let base64Image = undefined;

      if (data.image && data.image.length > 0) {
        base64Image = await fileToBase64(data.image[0]);
      }

      const payload = {
        ...data,
        image: base64Image,
        sizes: isDrink ? variations : undefined,
        isDrink,
        ...(isDrink ? {} : { price: data.price }),
      };

      updateMenuProduct(payload, id, navigate);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  const addVariation = () => {
    setVariations([...variations, { size: "", priceHot: "", priceIced: "" }]);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, idx) => idx !== index));
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  if (isLoading || !categories || !selectedMenuItem)
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
      <h1 className="text-center my-5 fw-bold">Update Product</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col lg={2} sm={0}></Col>
          <Col>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                {...register("name", { required: "Product name is required" })}
                type="text"
                className="rounded-0 focus-ring"
              />
              {errors.name && (
                <p className="text-danger">{errors.name.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} sm={0}></Col>
        </Row>

        <Row>
          <Col lg={2} sm={0}></Col>
          <Col>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("description", {
                  required: "Product description is required",
                })}
                className="rounded-0 focus-ring"
              />
              {errors.description && (
                <p className="text-danger">{errors.description.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} sm={0}></Col>
        </Row>

        <Row>
          <Col lg={2} sm={0}></Col>
          <Col>
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                {...register("image")}
                type="file"
                className="rounded-0 focus-ring"
              />
              {errors.image && (
                <p className="text-danger">{errors.image.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} sm={0}></Col>
        </Row>

        <Row>
          <Col lg={2} sm={0}></Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Categories</Form.Label>
              <Row>
                {categories.map((category) => (
                  <Col lg={4} sm={6} xs={12} key={category._id}>
                    <Form.Check
                      type="checkbox"
                      label={category.name}
                      value={category.name}
                      {...register("category", {
                        required: "At least one category is required",
                      })}
                    />
                  </Col>
                ))}
              </Row>
              {errors.category && (
                <p className="text-danger">{errors.category.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} sm={0}></Col>
        </Row>

        <Row>
          <Col lg={2} sm={0}></Col>
          <Col>
            <Form.Group className="mb-3" controlId="isDrink">
              <Form.Label>Is Drink?</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  label="Yes"
                  value={true}
                  {...register("isDrink", { required: "Select an option" })}
                />
                <Form.Check
                  type="radio"
                  label="No"
                  value={false}
                  {...register("isDrink", { required: "Select an option" })}
                />
              </div>
              {errors.isDrink && (
                <p className="text-danger">{errors.isDrink.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} sm={0}></Col>
        </Row>

        {isDrink ? (
          <>
            <Row>
              <Col lg={2} sm={0}></Col>
              <Col>
                <Form.Group className="mb-3" controlId="drinkType">
                  <Form.Label>Drink Type</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      label="Coffee"
                      value="Coffee"
                      {...register("drinkType", {
                        required: "Select drink type",
                      })}
                    />
                    <Form.Check
                      type="radio"
                      label="Frappe"
                      value="Frappe"
                      {...register("drinkType", {
                        required: "Select drink type",
                      })}
                    />
                  </div>
                  {errors.drinkType && (
                    <p className="text-danger">{errors.drinkType.message}</p>
                  )}
                </Form.Group>
              </Col>
              <Col lg={2} sm={0}></Col>
            </Row>

            <Row>
              <Col lg={2} sm={0}></Col>
              <Col>
                <Form.Label>Variations</Form.Label>
                {variations.map((variation, index) => (
                  <Row key={index} className="mb-3">
                    <Col>
                      <Form.Control
                        placeholder="Size"
                        value={variation.size}
                        onChange={(e) =>
                          handleVariationChange(index, "size", e.target.value)
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        placeholder="Hot Price"
                        type="number"
                        value={variation.priceHot}
                        disabled={drinkType === "Frappe"}
                        onChange={(e) =>
                          handleVariationChange(
                            index,
                            "priceHot",
                            e.target.value
                          )
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        placeholder="Iced Price"
                        type="number"
                        value={variation.priceIced}
                        onChange={(e) =>
                          handleVariationChange(
                            index,
                            "priceIced",
                            e.target.value
                          )
                        }
                      />
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="danger"
                        disabled={variations.length === 1}
                        onClick={() => removeVariation(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="secondary" onClick={addVariation}>
                  Add Variation
                </Button>
              </Col>
              <Col lg={2} sm={0}></Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col lg={2} sm={0}></Col>
            <Col>
              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  {...register("price", {
                    required: "Product price is required",
                  })}
                  type="text"
                  className="rounded-0 focus-ring"
                />
                {errors.price && (
                  <p className="text-danger">{errors.price.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col lg={2} sm={0}></Col>
          </Row>
        )}
        <Row>
          <Col lg={2} sm={0}></Col>
          <Col>
            {message && (
              <div className="alert alert-primary mt-3" role="alert">
                {message}
              </div>
            )}
          </Col>
          <Col lg={2} sm={0}></Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center gap-5 my-4">
            <button
              onClick={() => deleteMenuProduct(id, navigate)}
              className="btn btn-danger px-4"
            >
              Delete
            </button>
            <button type="submit" className="btn btn-primary px-4">
              Submit
            </button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UpdateProduct;
