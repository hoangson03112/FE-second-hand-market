import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { formatAddress } from "../../utils/checkoutUtils";
import { Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { AddressSectionProps } from "./types/Checkout.types";

const AddressSection: React.FC<AddressSectionProps> = ({ selectedAddress, onChangeAddress }) => {
  return (
    <div className="card mb-4 p-4 shadow-sm border-0">
      <h5 className="card-title text-danger d-flex align-items-center mb-3">
        <i className="bi bi-geo-alt me-2"></i>Địa Chỉ Nhận Hàng
      </h5>
      <div className="d-flex justify-content-between align-items-center">
        <div className="address-display ps-3 border-start border-2 border-danger">
          <p className="mb-1">
            <strong>{selectedAddress?.fullName}</strong>{" "}
            <span className="text-muted">({selectedAddress?.phoneNumber})</span>
            {selectedAddress?.isDefault && (
              <span className="badge bg-danger ms-2">Mặc định</span>
            )}
          </p>
          <p className="text-muted mb-0">
            <i className="bi bi-house-door me-2"></i>
            {formatAddress(selectedAddress)}
          </p>
        </div>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Edit />}
          onClick={onChangeAddress}
          sx={{ ml: 3 }}
        >
          Thay Đổi
        </Button>
      </div>
    </div>
  );
};

export default AddressSection;
