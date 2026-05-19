import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { formatAddress } from "../../utils/checkoutUtils";
import NewAddressForm from "./NewAddressForm";
import { AddressListProps, AddressModalProps, Address } from "./types/Checkout.types";

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onHide,
  currentUser,
}) => {
  if (!addresses.length) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-geo-alt text-muted fs-1"></i>
        <p className="mt-3 text-muted">Bạn chưa có địa chỉ nào</p>
      </div>
    );
  }

  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address);
    onHide(); // Đóng modal sau khi chọn địa chỉ
  };

  return (
    <div className="address-list">
      {addresses.map((address: Address) => (
        <div
          key={address._id}
          className={`address-item mb-3 p-3 rounded ${
            selectedAddress?._id === address._id
              ? "border-secondary bg-light"
              : "border"
          }`}
          onClick={() => handleSelectAddress(address)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="address-info">
              <div className="d-flex align-items-center mb-2">
                <h6 className="mb-0 me-2 fw-bold">{address?.fullName}</h6>
                <span className="text-muted">|</span>
                <span className="ms-2">{address?.phoneNumber}</span>
                {address.isDefault && (
                  <span className="badge bg-secondary ms-2">Mặc định</span>
                )}
              </div>
              <p className="mb-0 text-muted">
                <small>{formatAddress(address)}</small>
              </p>
            </div>
            <div className="address-actions">
              {selectedAddress?._id === address._id ? (
                <div className="selected-indicator">
                  <i className="bi bi-check-circle text-muted"></i>
                </div>
              ) : (
                <div className="radio-outline"></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AddressModal: React.FC<AddressModalProps> = ({
  show,
  onHide,
  addresses,
  selectedAddress,
  onSelectAddress,
  showNewAddressForm,
  onToggleNewAddressForm,
  onAddNewAddress,
  onAddressAdded,
  addressFormProps,
}) => {
  const { currentUser } = useAuth() as any;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header>
        <Modal.Title>
          <i className="bi bi-geo-alt me-2"></i>
          Địa Chỉ Giao Hàng
        </Modal.Title>
        <button
          type="button"
          className="btn-close"
          onClick={onHide}
          aria-label="Close"
        ></button>
      </Modal.Header>

      <Modal.Body className="p-0">
        {!showNewAddressForm ? (
          <div className="p-3">
            <AddressList
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelectAddress={onSelectAddress}
              onHide={onHide}
              currentUser={currentUser}
            />

            <div className="d-grid gap-2 mt-4">
              <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center"
                onClick={() => onToggleNewAddressForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Thêm địa chỉ mới
              </Button>
            </div>
          </div>
        ) : (
          <NewAddressForm {...addressFormProps} />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="light"
          onClick={() => {
            if (showNewAddressForm) {
              onToggleNewAddressForm(false);
            } else {
              onHide();
            }
          }}
        >
          {showNewAddressForm ? "Quay lại" : "Đóng"}
        </Button>

        {showNewAddressForm && (
          <Button
            className="save-address-btn"
            onClick={async () => {
              const newAddress = await onAddNewAddress();
              console.log(newAddress);
              if (newAddress && onAddressAdded) {
                onAddressAdded(newAddress);
                onHide();
              }
            }}
          >
            <i className="bi bi-save me-2"></i>Lưu địa chỉ
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;
