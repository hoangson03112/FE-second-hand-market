import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const AddressForm = ({
  newAddress,
  onChange,
  onSave,
  onCancel,
  provinces = [],
  districts = [],
  wards = [],
  filteredProvinces = [],
  filteredDistricts = [],
  filteredWards = [],
  showProvinceDropdown,
  showDistrictDropdown,
  showWardDropdown,
  setShowProvinceDropdown,
  setShowDistrictDropdown,
  setShowWardDropdown,
  handleSelectProvince,
  handleSelectDistrict,
  handleSelectWard,
  setFilteredProvinces,
  setFilteredDistricts,
  setFilteredWards,
}) => {
  console.log("filteredProvinces:", filteredProvinces);
  console.log("filteredDistricts:", filteredDistricts);
  console.log("filteredWards:", filteredWards);

  return (
    <Form className="p-3">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="fullName" className="mb-3 input-group-icon">
            <Form.Label>Họ tên</Form.Label>
            <span className="input-icon">
              <i className="bi bi-person"></i>
            </span>
            <Form.Control
              type="text"
              name="fullName"
              value={newAddress?.fullName}
              onChange={onChange}
              placeholder="Nhập họ tên"
              className="form-control-clean"
              style={{ paddingLeft: 18 }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="phoneNumber" className="mb-3 input-group-icon">
            <Form.Label>Số điện thoại</Form.Label>
            <span className="input-icon">
              <i className="bi bi-telephone"></i>
            </span>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={newAddress.phoneNumber}
              onChange={onChange}
              placeholder="Nhập số điện thoại"
              className="form-control-clean"
              style={{ paddingLeft: 18 }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4} className="mb-2 input-group-icon position-relative">
          <Form.Group controlId="province">
            <Form.Label>Tỉnh/Thành</Form.Label>
            <span className="input-icon">
              <i className="bi bi-geo-alt"></i>
            </span>
            <Form.Control
              type="text"
              name="province"
              autoComplete="off"
              placeholder="Nhập tỉnh/thành..."
              value={newAddress.province}
              onChange={onChange}
              className="form-control-clean"
              style={{ paddingLeft: 18 }}
              onFocus={(e) => {
                console.log("Province focus - provinces:", provinces);
                console.log(
                  "Province focus - filteredProvinces:",
                  filteredProvinces
                );
                setFilteredProvinces(provinces);
                setShowProvinceDropdown(true);
              }}
              onBlur={() =>
                setTimeout(() => setShowProvinceDropdown(false), 150)
              }
            />
            {showProvinceDropdown && (
              <div className="suggestion-dropdown">
                {filteredProvinces && filteredProvinces.length > 0 ? (
                  filteredProvinces.map((province) => (
                    <div
                      key={province.ProvinceID}
                      className="suggestion-item"
                      onMouseDown={() => handleSelectProvince(province)}
                    >
                      {province.ProvinceName}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item text-muted">
                    {provinces && provinces.length > 0
                      ? "Gõ để tìm..."
                      : "Không có dữ liệu"}
                  </div>
                )}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={4} className="mb-2 input-group-icon position-relative">
          <Form.Group controlId="district">
            <Form.Label>Quận/Huyện</Form.Label>
            <span className="input-icon">
              <i className="bi bi-signpost"></i>
            </span>
            <Form.Control
              type="text"
              name="district"
              autoComplete="off"
              placeholder="Nhập quận/huyện..."
              value={newAddress.district}
              onChange={onChange}
              className="form-control-clean"
              style={{ paddingLeft: 18 }}
              disabled={!newAddress.province}
              onFocus={(e) => {
                console.log("District focus - districts:", districts);
                console.log(
                  "District focus - filteredDistricts:",
                  filteredDistricts
                );
                setFilteredDistricts(districts);
                setShowDistrictDropdown(districts.length > 0);
              }}
              onBlur={() =>
                setTimeout(() => setShowDistrictDropdown(false), 150)
              }
            />
            {showDistrictDropdown && (
              <div className="suggestion-dropdown">
                {filteredDistricts && filteredDistricts.length > 0 ? (
                  filteredDistricts.map((district) => (
                    <div
                      key={district.DistrictID}
                      className="suggestion-item"
                      onMouseDown={() => handleSelectDistrict(district)}
                    >
                      {district.DistrictName}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item text-muted">
                    {districts && districts.length > 0
                      ? "Gõ để tìm..."
                      : "Không có dữ liệu"}
                  </div>
                )}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={4} className="mb-2 input-group-icon position-relative">
          <Form.Group controlId="ward">
            <Form.Label>Xã/Phường</Form.Label>
            <span className="input-icon">
              <i className="bi bi-geo"></i>
            </span>
            <Form.Control
              type="text"
              name="ward"
              autoComplete="off"
              placeholder="Nhập xã/phường..."
              value={newAddress.ward}
              onChange={onChange}
              className="form-control-clean"
              style={{ paddingLeft: 18 }}
              disabled={!newAddress.district}
              onFocus={(e) => {
                console.log("Ward focus - wards:", wards);
                console.log("Ward focus - filteredWards:", filteredWards);
                setFilteredWards(wards);
                setShowWardDropdown(wards.length > 0);
              }}
              onBlur={() => setTimeout(() => setShowWardDropdown(false), 150)}
            />
            {showWardDropdown && (
              <div className="suggestion-dropdown">
                {filteredWards && filteredWards.length > 0 ? (
                  filteredWards.map((ward) => (
                    <div
                      key={ward.WardCode}
                      className="suggestion-item"
                      onMouseDown={() => handleSelectWard(ward)}
                    >
                      {ward.WardName}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item text-muted">
                    {wards && wards.length > 0
                      ? "Gõ để tìm..."
                      : "Không có dữ liệu"}
                  </div>
                )}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3 input-group-icon" controlId="specificAddress">
        <Form.Label>Địa chỉ cụ thể</Form.Label>
        <span className="input-icon">
          <i className="bi bi-house"></i>
        </span>
        <Form.Control
          type="text"
          name="specificAddress"
          value={newAddress.specificAddress}
          onChange={onChange}
          className="form-control-clean"
          style={{ paddingLeft: 18 }}
          placeholder="Số nhà, tên đường..."
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="default">
        <Form.Check
          type="checkbox"
          name="default"
          label="Đặt làm địa chỉ mặc định"
          checked={newAddress.default}
          onChange={onChange}
        />
      </Form.Group>
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button variant="primary" onClick={onSave}>
          Lưu địa chỉ
        </Button>
      </div>
      <style jsx>{`
        .form-control-clean {
          border-radius: 8px;
          border: 1.5px solid #e0e0e0;
          padding-left: 38px;
          min-height: 44px;
          font-size: 1rem;
          background: #fafbfc;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: none;
          position: relative;
        }
        .form-control-clean:focus {
          border-color: #4f8cff;
          box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.12);
          background: #fff;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #bdbdbd;
          font-size: 1.1rem;
          pointer-events: none;
        }
        .input-group-icon {
          position: relative;
        }
        .suggestion-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #fff;
          border: 1.5px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(79, 140, 255, 0.1),
            0 1.5px 6px rgba(0, 0, 0, 0.04);
          margin-top: 4px;
          padding: 4px 0;
          animation: fadeInDropdown 0.18s ease;
          max-height: 220px;
          overflow-y: auto;
        }
        @keyframes fadeInDropdown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .suggestion-item {
          padding: 10px 20px;
          font-size: 1rem;
          color: #333;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.18s, color 0.18s, font-weight 0.18s;
          margin: 0 6px;
          user-select: none;
        }
        .suggestion-item:hover,
        .suggestion-item:active {
          background: linear-gradient(90deg, #e3f0ff 60%, #f0f7ff 100%);
          color: #2563eb;
          font-weight: 600;
        }
        .suggestion-item.text-muted {
          color: #bdbdbd;
          background: none;
          cursor: default;
          font-weight: 400;
        }
      `}</style>
    </Form>
  );
};

export default AddressForm;
