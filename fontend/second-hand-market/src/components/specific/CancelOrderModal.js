import React, { useState } from "react";

const CancelOrderModal = ({ orderId, onConfirm, onClose }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cancelReasons = [
    { id: "wrong_product", label: "Đặt nhầm sản phẩm" },
    { id: "change_mind", label: "Đổi ý không muốn mua nữa" },
    { id: "found_better_price", label: "Tìm được giá tốt hơn" },
    { id: "delivery_too_long", label: "Thời gian nhận hàng quá lâu" },
    { id: "change_address", label: "Muốn thay đổi địa chỉ nhận hàng" },
    { id: "other", label: "Lý do khác" },
  ];

  const handleSubmit = async () => {
    const finalReason =
      selectedReason === "other"
        ? otherReason
        : cancelReasons.find((r) => r.id === selectedReason)?.label;

    if (!finalReason?.trim()) {
      setError("Vui lòng chọn hoặc nhập lý do hủy đơn hàng");
      return;
    }
    onConfirm(orderId, finalReason,"CANCELLED");
    setIsSubmitting(true);
    try {
      onClose();
    } catch (error) {
      setError("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận hủy đơn hàng</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <p className="mb-3">Bạn có chắc chắn muốn hủy đơn hàng?</p>

              <div className="mb-3">
                <p className="form-label">Lý do hủy đơn hàng:</p>
                {cancelReasons.map((reason) => (
                  <div className="form-check mb-2" key={reason.id}>
                    <input
                      type="radio"
                      id={reason.id}
                      name="cancelReason"
                      className="form-check-input"
                      checked={selectedReason === reason.id}
                      onChange={() => setSelectedReason(reason.id)}
                    />
                    <label className="form-check-label" htmlFor={reason.id}>
                      {reason.label}
                    </label>
                  </div>
                ))}
              </div>

              {selectedReason === "other" && (
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Vui lòng nhập lý do của bạn..."
                    rows="3"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !selectedReason ||
                  (selectedReason === "other" && !otherReason.trim())
                }
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận hủy"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelOrderModal;
