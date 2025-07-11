import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { useCoin } from "../../contexts/CoinProvider";

const CheckInModal = ({ show, onHide }) => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { balance, checkIn } = useCoin();

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const result = await checkIn();
      if (result.status === "success") {
        setMessage(result.message);
        setSuccess(true);
      } else {
        setMessage(result.message);
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setMessage("");
    setSuccess(false);
    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      resetModal();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="md">
      <Modal.Header
        closeButton
        className="border-0 pb-2"
        style={{
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
          color: "white",
        }}
      >
        <Modal.Title className="fw-bold d-flex align-items-center">
          <i className="bi bi-calendar-check me-2"></i>
          Điểm danh hàng ngày
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-4">
        <Card className="border-0 shadow-sm mb-3">
          <Card.Body className="text-center py-4">
            <div className="mb-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  background:
                    "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                  boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                }}
              >
                <i
                  className="bi bi-coin text-white"
                  style={{ fontSize: "2.5rem" }}
                ></i>
              </div>
            </div>

            <h5 className="fw-bold text-dark mb-2">Nhận thưởng điểm danh</h5>

            <p className="text-muted mb-3">
              Điểm danh hàng ngày để nhận 200 xu miễn phí
            </p>

            <div className="d-flex justify-content-center align-items-center mb-3">
              <Badge
                bg="warning"
                className="px-3 py-2 fs-6 fw-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                  border: "none",
                }}
              >
                <i className="bi bi-wallet2 me-2"></i>
                {balance.toLocaleString()} xu
              </Badge>
            </div>
          </Card.Body>
        </Card>

        {message && (
          <Alert
            variant={success ? "success" : "danger"}
            className="text-center border-0 shadow-sm"
            style={{
              background: success
                ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)"
                : "linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%)",
            }}
          >
            <i
              className={`bi ${
                success ? "bi-check-circle" : "bi-exclamation-triangle"
              } me-2`}
            ></i>
            {message}
          </Alert>
        )}

        <div className="text-center mt-3">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Bạn có thể điểm danh một lần mỗi ngày
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pb-4 px-4">
        <div className="d-grid gap-2 w-100">
          <Button
            variant="warning"
            size="lg"
            onClick={handleCheckIn}
            disabled={loading}
            className="fw-bold border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              padding: "12px 0",
              borderRadius: "8px",
            }}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="bi bi-gift me-2"></i>
                Điểm danh ngay
              </>
            )}
          </Button>

          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="fw-semibold"
            style={{ borderRadius: "8px" }}
          >
            Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckInModal;
