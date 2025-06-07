import axios from "axios";
import React, { useEffect, useState } from "react";
import { Accordion, Form, Button } from "react-bootstrap";
import AppContext from "../../contexts/AppContext";

const FilterSidebar = ({ category }) => {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [showAllProvinces, setShowAllProvinces] = useState(false);
  const [showMoreColors, setShowMoreColors] = useState(false);

  const handleToggleMore = (e) => {
    e.preventDefault();
    setShowMoreCategories(!showMoreCategories);
  };

  const handleToggleProvinces = (e) => {
    e.preventDefault();
    setShowAllProvinces(!showAllProvinces);
  };

  const handleToggleColors = (e) => {
    e.preventDefault();
    setShowMoreColors(!showMoreColors);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await AppContext.fetchProvinces();
        console.log(response);

        if (response) {
          setProvinces(response.data);
        }
      } catch (err) {
        console.error("Error fetching provinces", err);
      }
    };
    fetchProvinces();
  }, []);

  return (
    <div className="filter-sidebar p-3">
      {/* Tìm kiếm */}
      <Form.Group className="mb-3">
        <Form.Control type="text" placeholder="Tìm sản phẩm" />
      </Form.Group>

      {/* Ưu đãi */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Ưu đãi</Accordion.Header>
          <Accordion.Body>
            <Form.Check type="checkbox" label="Freeship" />
            <Form.Check type="checkbox" label="Sản phẩm 0đ" />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Danh mục */}
      <Accordion defaultActiveKey="1" className="my-3">
        <Accordion.Item eventKey="1">
          <Accordion.Header>Danh mục</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="radio"
              label="Tất cả danh mục"
              name="subcategory"
            />
            {category?.subcategories?.map((subcategory, index) => (
              <Form.Check
                key={index}
                type="radio"
                label={subcategory.name}
                name="subcategory"
              />
            ))}
            {showMoreCategories && (
              <>
                <Form.Check
                  type="radio"
                  label="Danh mục thêm 1"
                  name="subcategory"
                />
                <Form.Check
                  type="radio"
                  label="Danh mục thêm 2"
                  name="subcategory"
                />
              </>
            )}
            <a
              href="/"
              onClick={handleToggleMore}
              className="text-decoration-none"
            >
              {showMoreCategories ? "Ẩn bớt" : "Xem thêm"}
            </a>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Giá */}
      <Accordion defaultActiveKey="2" className="my-3">
        <Accordion.Item eventKey="2">
          <Accordion.Header>Giá</Accordion.Header>
          <Accordion.Body>
            <Form.Check type="radio" label="Tất cả" name="price" />
            <Form.Check type="radio" label="Sản phẩm 0đ" name="price" />
            <Form.Check type="radio" label="Dưới 100.000đ" name="price" />
            <Form.Check type="radio" label="100.000đ - 200.000đ" name="price" />
            <Form.Check type="radio" label="200.000đ - 500.000đ" name="price" />
            <Form.Check type="radio" label="Trên 500.000đ" name="price" />
            <Form.Label>Chọn Khoảng giá</Form.Label>
            <div className="d-flex mb-3">
              <Form.Control type="text" placeholder="Từ" className="me-2" />
              <Form.Control type="text" placeholder="Đến" />
            </div>
            <Button variant="outline-primary">Áp dụng</Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Nơi bán */}
      <Accordion defaultActiveKey="3" className="my-3">
        <Accordion.Item eventKey="3">
          <Accordion.Header>Nơi bán</Accordion.Header>
          <Accordion.Body>
            {provinces
              ?.slice(0, showAllProvinces ? provinces.length : 8)
              .map((province, index) => (
                <Form.Check key={index} type="checkbox" label={province.name} />
              ))}
            <a
              href="/"
              onClick={handleToggleProvinces}
              className="text-decoration-none"
            >
              {showAllProvinces ? "Ẩn bớt" : "Xem thêm"}
            </a>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Tình trạng */}
      <Accordion defaultActiveKey="4" className="my-3">
        <Accordion.Item eventKey="4">
          <Accordion.Header>Tình trạng</Accordion.Header>
          <Accordion.Body>
            <Form.Check type="checkbox" label="Mới" />
            <Form.Check type="checkbox" label="Như mới" />
            <Form.Check type="checkbox" label="Tốt" />
            <Form.Check type="checkbox" label="Trung bình" />
            <Form.Check type="checkbox" label="Kém" />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Màu sắc */}
      <Accordion defaultActiveKey="5" className="my-3">
        <Accordion.Item eventKey="5">
          <Accordion.Header>Màu sắc</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="checkbox"
              label={
                <>
                  <span className="me-2">Trắng</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "50%",
                    }}
                  ></span>
                </>
              }
            />
            <Form.Check
              type="checkbox"
              label={
                <>
                  <span className="me-2">Đen</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "black",
                      borderRadius: "50%",
                    }}
                  ></span>
                </>
              }
            />
            <Form.Check
              type="checkbox"
              label={
                <>
                  <span className="me-2">Xanh lá</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#00FF00",
                      borderRadius: "50%",
                    }}
                  ></span>
                </>
              }
            />
            <Form.Check
              type="checkbox"
              label={
                <>
                  <span className="me-2">Xanh nước biển</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#00FFFF",
                      borderRadius: "50%",
                    }}
                  ></span>
                </>
              }
            />
            <Form.Check
              type="checkbox"
              label={
                <>
                  <span className="me-2">Đỏ</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                    }}
                  ></span>
                </>
              }
            />

            {showMoreColors && <>{/* Add more color options here */}</>}

            <a
              href="/"
              onClick={handleToggleColors}
              className="text-decoration-none"
            >
              {showMoreColors ? "Ẩn bớt" : "Xem thêm"}
            </a>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
