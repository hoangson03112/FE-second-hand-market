import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  // Chức năng điều hướng khi nhấn nút "Trở về trang chủ"
  const goToHomePage = () => {
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center p-4 shadow-sm">
            <Card.Body>
              <i
                className="bi bi-check-circle-fill"
                style={{ fontSize: "4rem", color: "green" }}
              ></i>
              <Card.Title className="my-3">Đặt hàng thành công!</Card.Title>
              <Card.Text>
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và sẽ
                sớm được xử lý.
              </Card.Text>
              <Button variant="primary" onClick={goToHomePage}>
                Trở về trang chủ
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccess;
