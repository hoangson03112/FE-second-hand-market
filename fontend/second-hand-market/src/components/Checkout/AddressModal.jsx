import React from "react";
import { Modal, Button } from "react-bootstrap";
import AddressForm from "./AddressForm";
import { formatAddress } from "../../utils/formatAddress";

const AddressModal = ({
  show,
  onClose,
  addresses,
  selectedAddress,
  onSelect,
  currentUser,
  showNewAddressForm,
  setShowNewAddressForm,
  newAddress,
  onChange,
  onSave,
  onCancel,
  provinces,
  districts,
  wards,
  handleSelectProvince,
  handleSelectDistrict,
  handleSelectWard,
  showProvinceDropdown,
  setShowProvinceDropdown,
  showDistrictDropdown,
  setShowDistrictDropdown,
  showWardDropdown,
  setShowWardDropdown,
  filteredProvinces,
  filteredDistricts,
  filteredWards,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>
          <i className="bi bi-geo-alt me-2"></i>
          Địa Chỉ Giao Hàng
        </Modal.Title>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </Modal.Header>
      <Modal.Body className="p-0">
        {!showNewAddressForm ? (
          <div className="address-list p-3">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address._id}
                  className={`address-item mb-3 p-3 rounded ${selectedAddress?._id === address._id ? "border-primary bg-light" : "border"}`}
                  onClick={() => onSelect(address)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="address-info">
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0 me-2 fw-bold">{currentUser?.fullName}</h6>
                        <span className="text-muted">|</span>
                        <span className="ms-2">{currentUser?.phoneNumber}</span>
                        {address.default && <span className="badge bg-danger ms-2">Mặc định</span>}
                      </div>
                      <p className="mb-0 text-muted">
                        <small>{formatAddress(address)}</small>
                      </p>
                    </div>
                    <div className="address-actions">
                      {selectedAddress?._id === address._id ? (
                        <div className="selected-indicator">
                          <i className="bi bi-check-circle text-primary"></i>
                        </div>
                      ) : (
                        <div className="radio-outline"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-geo-alt text-muted fs-1"></i>
                <p className="mt-3 text-muted">Bạn chưa có địa chỉ nào</p>
              </div>
            )}
            <div className="d-grid gap-2 mt-4">
              <Button variant="outline-primary" className="d-flex align-items-center justify-content-center" onClick={() => setShowNewAddressForm(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Thêm địa chỉ mới
              </Button>
            </div>
          </div>
        ) : (
          <AddressForm
            newAddress={newAddress}
            onChange={onChange}
            onSave={onSave}
            onCancel={onCancel}
            provinces={provinces}
            districts={districts}
            wards={wards}
            handleSelectProvince={handleSelectProvince}
            handleSelectDistrict={handleSelectDistrict}
            handleSelectWard={handleSelectWard}
            showProvinceDropdown={showProvinceDropdown}
            setShowProvinceDropdown={setShowProvinceDropdown}
            showDistrictDropdown={showDistrictDropdown}
            setShowDistrictDropdown={setShowDistrictDropdown}
            showWardDropdown={showWardDropdown}
            setShowWardDropdown={setShowWardDropdown}
            filteredProvinces={filteredProvinces}
            filteredDistricts={filteredDistricts}
            filteredWards={filteredWards}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => {
          if (showNewAddressForm) setShowNewAddressForm(false);
          else onClose();
        }}>
          {showNewAddressForm ? "Quay lại" : "Đóng"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal; 