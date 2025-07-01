import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCart } from "../../contexts/CartContext";
import { useProduct } from "../../contexts/ProductContext";
import AddressContext from "../../contexts/AddressContext";
import { useAuth } from "../../contexts/AuthContext";
import AccountContext from "../../contexts/AccountContext";
import VoucherSelector from "../../pages/Voucher/VoucherSelector";
const Checkout = () => {
  const { getProduct } = useProduct();
  const { deleteItem } = useCart();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const [products, setProducts] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("direct");
  const [paymentMethod, setPaymentMethod] = useState("direct");
  const [shippingFee, setShippingFee] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [codAmount, setCodAmount] = useState(0);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    specificAddress: "",
    ward: "",
    district: "",
    province: "",
    isDefault: false,
  });

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // States for location suggestions
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const GHN_TOKEN = process.env.GHN_TOKEN;
  const API_URL = process.env.GHN_URL;
  const [sellers, setSellers] = useState([]);
  const formatAddress = (address) => {
    if (!address) return "";
    const { specificAddress, ward, district, province } = address;
    return [specificAddress, ward, district, province]
      .filter(Boolean)
      .join(", ");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          selectedItems.map((item) => getProduct(item._id))
        );
        setProducts(productsData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAddresses = async () => {
      const addresses = await AddressContext.getAddresses();

      setAddresses(addresses);

      const defaultAddress = addresses.find(
        (address) => address.isDefault === true
      );
      setSelectedAddress(defaultAddress);
    };

    fetchProducts();
    fetchAddresses();
  }, [selectedItems]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const uniqueSellerIds = Array.from(
          new Set(products.map((product) => product.seller._id))
        );

        const sellerPromises = uniqueSellerIds.map((sellerId) =>
          AccountContext.getAccount(sellerId)
        );
        const sellersData = await Promise.all(sellerPromises);

        setSellers(sellersData);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };

    if (products.length > 0) {
      fetchSellers();
    }
  }, [products]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${API_URL}/province`, {
          headers: { Token: GHN_TOKEN },
        });
        console.log(response.data.data);
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (newAddress.province) {
        try {
          const selectedProvince = provinces.find(
            (p) => p.ProvinceName === newAddress.province
          );
          if (selectedProvince) {
            const response = await axios.get(`${API_URL}/district`, {
              headers: { Token: GHN_TOKEN },
              params: { province_id: selectedProvince.ProvinceID },
            });
            setDistricts(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [newAddress.province, provinces]);

  useEffect(() => {
    const fetchWards = async () => {
      if (newAddress.district) {
        try {
          const selectedDistrict = districts.find(
            (d) => d.DistrictName === newAddress.district
          );
          if (selectedDistrict) {
            const response = await axios.get(`${API_URL}/ward`, {
              headers: { Token: GHN_TOKEN },
              params: { district_id: selectedDistrict.DistrictID },
            });
            setWards(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      } else {
        setWards([]);
      }
    };

    fetchWards();
  }, [newAddress.district, districts]);

  // Calculate shipping fee and payment amounts when dependencies change
  useEffect(() => {
    const fee = calculateShippingFee(shippingMethod, selectedAddress);
    setShippingFee(fee);
    calculatePaymentAmounts(paymentMethod, getFinalAmount(), fee);
  }, [shippingMethod, selectedAddress, paymentMethod, voucherDiscount]);

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item._id);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  };

  const getFinalAmount = () => {
    return Math.max(0, getTotalAmount() - voucherDiscount);
  };

  const calculateShippingFee = (method, address) => {
    if (method === "direct") return 0;

    // Simple calculation - in real app, use GHN API
    const baseRate = {
      express: 45000,
    };

    return baseRate[method] || 45000;
  };

  const calculatePaymentAmounts = (paymentType, totalAmount, shippingFee) => {
    const platformFeeRate = paymentType === "direct" ? 0 : 0.02; // 2% cho protected transactions
    const calculatedPlatformFee = totalAmount * platformFeeRate;

    setPlatformFee(calculatedPlatformFee);

    switch (paymentType) {
      case "direct":
        setDepositAmount(0);
        setCodAmount(0);
        break;
      case "partial_escrow":
        setDepositAmount(shippingFee);
        setCodAmount(totalAmount);
        break;
      case "full_escrow":
        setDepositAmount(totalAmount + shippingFee + calculatedPlatformFee);
        setCodAmount(0);
        break;
      default:
        setDepositAmount(0);
        setCodAmount(totalAmount);
    }
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
    const fee = calculateShippingFee(method, selectedAddress);
    setShippingFee(fee);

    // Reset payment method if switching to/from direct
    if (method === "direct") {
      setPaymentMethod("direct");
    } else if (paymentMethod === "direct") {
      setPaymentMethod("partial_escrow");
    }

    calculatePaymentAmounts(paymentMethod, getFinalAmount(), fee);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    calculatePaymentAmounts(method, getFinalAmount(), shippingFee);
    setShowPaymentGateway(method !== "direct" && depositAmount > 0);
  };

  const handleVoucherSelect = (voucher, discount) => {
    setSelectedVoucher(voucher);
    setVoucherDiscount(discount);
    setShowVoucherModal(false);
  };

  const handleDeleteItems = async () => {
    const ids = selectedItems.map((item) => item._id);
    await deleteItem(ids);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      products: selectedItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      totalAmount: getFinalAmount(),
      shippingMethod,
      paymentMethod: "cod",
      shippingAddress: selectedAddress?._id,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để tiếp tục.");
        navigate("/login");
        return;
      }

      const productsData = await Promise.all(
        orderData.products.map((product) => getProduct(product.productId))
      );

      const uniqueSellerIds = Array.from(
        new Set(
          productsData.map((product) => product.seller._id).filter(Boolean)
        )
      );

      const ordersBySeller = uniqueSellerIds
        .map((sellerId) => {
          const sellerProducts = productsData
            .filter((product) => product.seller._id === sellerId)
            .map((product) => {
              const orderProduct = orderData.products.find(
                (item) => item.productId === product._id
              );
              return {
                productId: product._id,
                quantity: orderProduct ? orderProduct.quantity : 0,
              };
            })
            .filter((product) => product.quantity > 0);

          return {
            sellerId,
            products: sellerProducts,
          };
        })
        .filter((order) => order.products.length > 0);

      // Tạo các đơn hàng
      for (const order of ordersBySeller) {
        const orderPayload = {
          totalAmount: getFinalAmount(),
          shippingMethod,
          paymentMethod: "cod",
          shippingAddress: orderData.shippingAddress,
          sellerId: order.sellerId,
          products: order.products,
        };

        await axios.post("  /orders", orderPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (selectedVoucher && selectedVoucher.id) {
        try {
          await axios.post(
            "  /vouchers/use",
            { voucherId: selectedVoucher.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (voucherError) {
          console.error("Error updating voucher usage:", voucherError);
        }
      }

      Swal.fire({
        title: "Thông báo!",
        text: "Tạo đơn hàng thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/eco-market/customer/orders");
      handleDeleteItems();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "province") {
      const filtered = provinces.filter((province) =>
        (province.ProvinceName || "")
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredProvinces(filtered);
      setShowProvinceDropdown(filtered.length > 0 && value.length > 0);
    } else if (name === "district") {
      const filtered = districts.filter((district) =>
        (district.DistrictName || "")
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredDistricts(filtered);
      setShowDistrictDropdown(filtered.length > 0 && value.length > 0);
    } else if (name === "ward") {
      const filtered = wards.filter((ward) =>
        (ward.WardName || "").toLowerCase().includes(value.toLowerCase())
      );
      setFilteredWards(filtered);
      setShowWardDropdown(filtered.length > 0 && value.length > 0);
    }
  };

  const handleSelectProvince = (province) => {
    setNewAddress({
      ...newAddress,
      province: province.ProvinceName,
      district: "",
      ward: "",
    });
    setShowProvinceDropdown(false);
  };

  const handleSelectDistrict = (district) => {
    setNewAddress({
      ...newAddress,
      district: district.DistrictName,
      ward: "",
    });
    setShowDistrictDropdown(false);
  };

  const handleSelectWard = (ward) => {
    setNewAddress({
      ...newAddress,
      ward: ward.WardName,
    });
    setShowWardDropdown(false);
  };

  const handleAddNewAddress = async () => {
    try {
      if (
        !newAddress.fullName ||
        !newAddress.phoneNumber ||
        !newAddress.specificAddress ||
        !newAddress.ward ||
        !newAddress.district ||
        !newAddress.province
      ) {
        alert("Vui lòng điền đầy đủ thông tin địa chỉ");
        return;
      }

      await AddressContext.createAddress(newAddress);

      const updatedAddresses = await AddressContext.getAddresses();
      setAddresses(updatedAddresses);

      const addedAddress = updatedAddresses[updatedAddresses.length - 1];
      if (newAddress.isDefault || updatedAddresses.length === 1) {
        setSelectedAddress(addedAddress);
      }

      setNewAddress({
        fullName: "",
        phoneNumber: "",
        specificAddress: "",
        ward: "",
        district: "",
        province: "",
        isDefault: false,
      });
      setShowNewAddressForm(false);
    } catch (error) {
      console.error("Error adding new address:", error);
      alert("Có lỗi xảy ra khi thêm địa chỉ mới");
    }
  };

  return (
    <div className="container py-4">
      <div className="card mb-4 p-4 shadow-sm border-0">
        <h5 className="card-title text-danger d-flex align-items-center mb-3">
          <i className="bi bi-geo-alt me-2"></i>Địa Chỉ Nhận Hàng
        </h5>
        <div className="d-flex justify-content-between align-items-center">
          <div className="address-display ps-3 border-start border-2 border-danger">
            <p className="mb-1">
              <strong>
                {selectedAddress?.fullName || currentUser?.fullName}
              </strong>{" "}
              <span className="text-muted">
                ({selectedAddress?.phoneNumber || currentUser?.phoneNumber})
              </span>
            </p>
            <p className="text-muted mb-0">
              <i className="bi bi-house-door me-2"></i>
              {formatAddress(selectedAddress)}
            </p>
          </div>
          <div className="me-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowAddressModal(true)}
            >
              <i className="bi bi-pencil me-2"></i>Thay Đổi
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>
            <i className="bi bi-geo-alt me-2"></i>
            Địa Chỉ Giao Hàng
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAddressModal(false)}
            aria-label="Close"
          ></button>
        </Modal.Header>
        <Modal.Body className="p-0">
          {!showNewAddressForm ? (
            <div className="address-list p-3">
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`address-item mb-3 p-3 rounded ${
                      selectedAddress?._id === address._id
                        ? "border-primary bg-light"
                        : "border"
                    }`}
                    onClick={() => handleAddressSelect(address)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="address-info">
                        <div className="d-flex align-items-center mb-2">
                          <h6 className="mb-0 me-2 fw-bold">
                            {currentUser?.fullName}
                          </h6>
                          <span className="text-muted">|</span>
                          <span className="ms-2">
                            {currentUser?.phoneNumber}
                          </span>
                          {address.isDefault && (
                            <span className="badge bg-danger ms-2">
                              Mặc định
                            </span>
                          )}
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
                <Button
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm địa chỉ mới
                </Button>
              </div>
            </div>
          ) : (
            <div className="new-address-form p-4">
              <h6 className="mb-4 border-bottom pb-2">
                <i className="bi bi-plus-circle me-2"></i>
                Thêm địa chỉ mới
              </h6>

              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group
                      controlId="fullName"
                      className="mb-3 input-group-icon"
                    >
                      <Form.Label className="form-label">Họ tên</Form.Label>
                      <span className="input-icon">
                        <i className="bi bi-person"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="fullName"
                        placeholder="Nhập họ tên"
                        value={newAddress.fullName}
                        onChange={handleNewAddressChange}
                        className="form-control-clean"
                        style={{ paddingLeft: 18 }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      controlId="phoneNumber"
                      className="mb-3 input-group-icon"
                    >
                      <Form.Label className="form-label">
                        Số điện thoại
                      </Form.Label>
                      <span className="input-icon">
                        <i className="bi bi-telephone"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="phoneNumber"
                        placeholder="Nhập số điện thoại"
                        value={newAddress.phoneNumber}
                        onChange={handleNewAddressChange}
                        className="form-control-clean"
                        style={{ paddingLeft: 18 }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col
                    md={4}
                    className="mb-2 input-group-icon position-relative"
                  >
                    <Form.Group controlId="province">
                      <Form.Label className="form-label">Tỉnh/Thành</Form.Label>
                      <span className="input-icon">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="province"
                        autoComplete="off"
                        placeholder="Nhập tỉnh/thành..."
                        value={newAddress.province}
                        onChange={handleNewAddressChange}
                        className="form-control-clean"
                        style={{ paddingLeft: 18 }}
                        onFocus={() => {
                          if (!newAddress.province) {
                            setFilteredProvinces(provinces);
                          }
                          setShowProvinceDropdown(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setShowProvinceDropdown(false), 150)
                        }
                      />
                      {showProvinceDropdown && (
                        <div className="suggestion-dropdown">
                          {filteredProvinces.length > 0 ? (
                            filteredProvinces.map((province) => (
                              <div
                                key={province.ProvinceID}
                                className="suggestion-item"
                                onMouseDown={() =>
                                  handleSelectProvince(province)
                                }
                              >
                                {province.ProvinceName}
                              </div>
                            ))
                          ) : (
                            <div className="suggestion-item text-muted">
                              Không có kết quả
                            </div>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col
                    md={4}
                    className="mb-2 input-group-icon position-relative"
                  >
                    <Form.Group controlId="district">
                      <Form.Label className="form-label">Quận/Huyện</Form.Label>
                      <span className="input-icon">
                        <i className="bi bi-signpost"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="district"
                        autoComplete="off"
                        placeholder="Nhập quận/huyện..."
                        value={newAddress.district}
                        onChange={handleNewAddressChange}
                        className="form-control-clean"
                        style={{ paddingLeft: 18 }}
                        disabled={!newAddress.province}
                        onFocus={() => {
                          if (!newAddress.district) {
                            setFilteredDistricts(districts);
                          }
                          setShowDistrictDropdown(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setShowDistrictDropdown(false), 150)
                        }
                      />
                      {showDistrictDropdown && (
                        <div className="suggestion-dropdown">
                          {filteredDistricts.length > 0 ? (
                            filteredDistricts.map((district) => (
                              <div
                                key={district.DistrictID}
                                className="suggestion-item"
                                onMouseDown={() =>
                                  handleSelectDistrict(district)
                                }
                              >
                                {district.DistrictName}
                              </div>
                            ))
                          ) : (
                            <div className="suggestion-item text-muted">
                              Không có kết quả
                            </div>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col
                    md={4}
                    className="mb-2 input-group-icon position-relative"
                  >
                    <Form.Group controlId="ward">
                      <Form.Label className="form-label">Xã/Phường</Form.Label>
                      <span className="input-icon">
                        <i className="bi bi-geo"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="ward"
                        autoComplete="off"
                        placeholder="Nhập xã/phường..."
                        value={newAddress.ward}
                        onChange={handleNewAddressChange}
                        className="form-control-clean"
                        style={{ paddingLeft: 18 }}
                        disabled={!newAddress.district}
                        onFocus={() => {
                          if (!newAddress.ward) {
                            setFilteredWards(wards);
                          }
                          setShowWardDropdown(true);
                        }}
                        onBlur={() =>
                          setTimeout(() => setShowWardDropdown(false), 150)
                        }
                      />
                      {showWardDropdown && (
                        <div className="suggestion-dropdown">
                          {filteredWards.length > 0 ? (
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
                              Không có kết quả
                            </div>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group
                  className="mb-4 input-group-icon"
                  controlId="specificAddress"
                >
                  <Form.Label className="form-label">Địa chỉ cụ thể</Form.Label>
                  <span className="input-icon">
                    <i className="bi bi-house"></i>
                  </span>
                  <Form.Control
                    type="text"
                    name="specificAddress"
                    placeholder="Số nhà, tên đường..."
                    value={newAddress.specificAddress}
                    onChange={handleNewAddressChange}
                    className="form-control-clean"
                    style={{ paddingLeft: 18 }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="isDefault">
                  <Form.Check
                    type="checkbox"
                    name="isDefault"
                    label="Đặt làm địa chỉ mặc định"
                    checked={newAddress.isDefault}
                    onChange={handleNewAddressChange}
                  />
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => {
              if (showNewAddressForm) {
                setShowNewAddressForm(false);
              } else {
                setShowAddressModal(false);
              }
            }}
          >
            {showNewAddressForm ? "Quay lại" : "Đóng"}
          </Button>

          {showNewAddressForm && (
            <Button className="save-address-btn" onClick={handleAddNewAddress}>
              <i className="bi bi-save me-2"></i>Lưu địa chỉ
            </Button>
          )}
        </Modal.Footer>
      </Modal>

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
        .new-address-form {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
          padding: 32px 24px 18px 24px;
          margin: 0 8px;
        }
        .new-address-form h6 {
          font-weight: 700;
          color: #4f8cff;
          letter-spacing: 0.5px;
        }
        .form-label {
          font-weight: 500;
          color: #495057;
          margin-bottom: 4px;
        }
        .save-address-btn {
          border-radius: 24px;
          font-weight: 600;
          padding: 10px 32px;
          font-size: 1.1rem;
          background: linear-gradient(90deg, #4f8cff 60%, #38c6ff 100%);
          border: none;
          color: #fff;
          box-shadow: 0 2px 8px rgba(79, 140, 255, 0.1);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .save-address-btn:hover {
          background: linear-gradient(90deg, #38c6ff 0%, #4f8cff 100%);
          box-shadow: 0 4px 16px rgba(79, 140, 255, 0.18);
        }
        .input-group-icon {
          position: relative;
        }
        /* --- Dropdown gợi ý đẹp hơn --- */
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
        .voucher-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .voucher-section::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          transform: rotate(45deg);
        }
        .voucher-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .voucher-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
          transform: translateY(-2px);
        }
        .voucher-selected {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.5);
        }

        /* Payment Options Styling */
        .payment-option {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          background: #ffffff;
          height: 100%;
          cursor: pointer;
        }

        .payment-option:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
          transform: translateY(-2px);
        }

        .payment-option.selected {
          border-color: #007bff;
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f0ff 100%);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.2);
        }

        .payment-header {
          margin-bottom: 15px;
        }

        .payment-breakdown {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
          margin: 15px 0;
        }

        .breakdown-item {
          display: flex;
          justify-content: between;
          align-items: flex-start;
          margin-bottom: 8px;
          flex-direction: column;
        }

        .breakdown-item:last-child {
          margin-bottom: 0;
        }

        .benefits-list {
          margin-top: 15px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          font-size: 0.9rem;
        }

        .benefit-item:last-child {
          margin-bottom: 0;
        }

        /* Payment Gateway Styling */
        .payment-gateway {
          background: linear-gradient(135deg, #f1f3f4 0%, #e8eaf0 100%);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #dee2e6;
        }

        .payment-gateway-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: white;
          border: 2px solid #e9ecef;
          text-decoration: none;
          color: #495057;
        }

        .payment-gateway-btn:hover {
          border-color: #007bff;
          background: #f8f9ff;
          color: #007bff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
        }

        .gateway-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;
          margin-bottom: 5px;
        }

        .payment-gateway-btn i {
          font-size: 24px;
          margin-bottom: 5px;
        }

        .payment-gateway-btn span {
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Order Summary Styling */
        .order-summary {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin-top: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .summary-row:last-child {
          margin-bottom: 0;
        }

        .summary-row.highlight {
          background: linear-gradient(135deg, #e3f0ff 0%, #f0f7ff 100%);
          padding: 8px 12px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
          margin: 4px 0;
        }

        .summary-row.total-row {
          background: linear-gradient(135deg, #d4edda 0%, #e8f5e8 100%);
          padding: 8px 12px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
          margin: 4px 0;
        }

        /* Shipping Options Enhanced */
        .shipping-option {
          transition: all 0.3s ease;
          border: 2px solid #e9ecef;
        }

        .shipping-option:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .shipping-option.border-primary {
          border-color: #007bff !important;
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f0ff 100%);
        }
      `}</style>

      <div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="bg-light">
                  <th
                    className="fs-5 fw-normal text-start"
                    style={{ width: "60%" }}
                  ></th>
                  <th
                    className="fs-6 fw-normal text-center"
                    style={{ width: "15%" }}
                  >
                    Đơn giá
                  </th>
                  <th
                    className="fs-6 fw-normal text-center"
                    style={{ width: "10%" }}
                  >
                    Số lượng
                  </th>
                  <th
                    className="fs-6 fw-normal text-danger text-center"
                    style={{ width: "15%" }}
                  >
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => {
                  const sellerProducts = products.filter(
                    (product) => product.seller._id === seller._id
                  );

                  if (sellerProducts.length === 0) {
                    return null;
                  }
                  return (
                    <React.Fragment key={seller._id}>
                      <tr className="border-top mt-3">
                        <td colSpan="6">
                          <div className="d-flex align-items-center w-100 mb-2">
                            <img
                              src={seller?.avatar.url}
                              alt="Avatar"
                              className="rounded-circle"
                              width="50"
                              height="50"
                            />
                            <span className="ms-3 text-primary-custom">
                              {seller.fullName || "Loading..."}
                            </span>
                          </div>
                        </td>
                      </tr>
                      {sellerProducts.map((product) => {
                        const item = selectedItems.find(
                          (item) => item._id === product._id
                        );
                        return item ? (
                          <tr key={product._id}>
                            <td className="text-start">
                              <img
                                src={product.avatar.url}
                                alt={product.name}
                                className="img-fluid"
                                style={{
                                  width: "80px",
                                  height: "100px",
                                  objectFit: "contain",
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                }}
                              />
                              <div
                                className="ms-3"
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                }}
                              >
                                <p className="mb-1 fw-bold">{product.name}</p>
                                {/* <p className="text-muted mb-0">
                               
                                </p> */}
                              </div>
                            </td>
                            <td className="text-center">
                              {product.price.toLocaleString("vi-VN")}₫
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-center text-danger">
                              {(item.quantity * product.price).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Voucher Section */}
      <div className="card mb-4 voucher-section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 d-flex align-items-center">
                <i className="bi bi-ticket-perforated me-2"></i>
                Mã giảm giá
              </h5>
              {selectedVoucher ? (
                <div>
                  <p className="mb-1">
                    <strong>{selectedVoucher.name}</strong>
                  </p>
                  <p className="mb-0 small opacity-75">
                    Mã: {selectedVoucher.code} | Giảm:{" "}
                    {voucherDiscount.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ) : (
                <p className="mb-0 opacity-75">Chọn hoặc nhập mã giảm giá</p>
              )}
            </div>
            <button
              className={`btn ${
                selectedVoucher ? "voucher-selected" : "voucher-btn"
              }`}
              onClick={() => setShowVoucherModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {selectedVoucher ? "Đổi voucher" : "Chọn voucher"}
            </button>
          </div>
        </div>
      </div>

      <VoucherSelector
        open={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        orderAmount={getTotalAmount()}
        onVoucherSelect={handleVoucherSelect}
        selectedVoucher={selectedVoucher}
        discount={voucherDiscount}
      />

      <div className="card mb-3">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-truck me-2 text-primary"></i>
            Phương thức vận chuyển
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div
                className={`card h-100 shipping-option ${
                  shippingMethod === "direct" ? "border-primary shadow-lg" : ""
                }`}
                onClick={() => handleShippingMethodChange("direct")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-people-fill fs-1 text-success"></i>
                  </div>
                  <h6 className="card-title">Gặp mặt trực tiếp</h6>
                  <p className="card-text text-muted small">
                    Tự thỏa thuận địa điểm giao dịch với người bán
                  </p>
                  <p className="text-success small fw-semibold">
                    <i className="bi bi-check-circle me-1"></i>Kiểm tra hàng
                    trước khi nhận
                  </p>
                  <div className="mt-2">
                    <span className="badge bg-success text-white">
                      Miễn phí
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  {shippingMethod === "direct" && (
                    <button className="btn btn-sm btn-success w-100">
                      <i className="bi bi-check-circle me-1"></i> Đã chọn
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className={`card h-100 shipping-option ${
                  shippingMethod === "express" ? "border-primary shadow-lg" : ""
                }`}
                onClick={() => handleShippingMethodChange("express")}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="bi bi-lightning-fill fs-1 text-warning"></i>
                  </div>
                  <h6 className="card-title">Giao hàng tận nơi</h6>
                  <p className="card-text text-muted small">
                    Shipper giao hàng, thanh toán khi nhận
                  </p>
                  <p className="text-success small fw-semibold">
                    <i className="bi bi-check-circle me-1"></i>Kiểm tra hàng
                    trước khi nhận
                  </p>
                  <div className="mt-2">
                    <span className="badge bg-warning text-dark">45,000₫</span>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  {shippingMethod === "express" && (
                    <button className="btn btn-sm btn-success w-100">
                      <i className="bi bi-check-circle me-1"></i> Đã chọn
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {shippingMethod && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Thông tin vận chuyển
              </h6>
              <ul className="list-unstyled">
                {shippingMethod === "direct" && (
                  <>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Bạn sẽ
                      nhận hàng trực tiếp từ người bán
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Kiểm
                      tra hàng trước khi thanh toán
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Thời
                      gian giao dịch linh hoạt
                    </li>
                  </>
                )}
                {shippingMethod === "express" && (
                  <>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Shipper
                      giao hàng tận nơi
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Kiểm
                      tra hàng trước khi thanh toán
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Theo
                      dõi đơn hàng trực tuyến
                    </li>
                    <li>
                      <i className="bi bi-check2 me-2 text-success"></i> Bảo
                      hiểm hàng hóa trong quá trình vận chuyển
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Payment Method Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-credit-card me-2 text-primary"></i>
            Phương thức thanh toán
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {shippingMethod === "direct" ? (
              <div className="col-12">
                <div className="payment-option selected">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="bi bi-people-fill fs-2 text-success"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Giao dịch trực tiếp</h6>
                      <p className="text-muted mb-0 small">
                        Thanh toán trực tiếp khi gặp mặt người bán
                      </p>
                    </div>
                    <div className="ms-auto">
                      <span className="badge bg-success">Miễn phí</span>
                    </div>
                  </div>
                  <div className="alert alert-info mt-3 mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Bạn tự thỏa thuận với người bán về địa điểm và thanh toán.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="col-md-6">
                  <div
                    className={`payment-option ${
                      paymentMethod === "partial_escrow" ? "selected" : ""
                    }`}
                    onClick={() => handlePaymentMethodChange("partial_escrow")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="payment-header">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-1">COD với cọc ship</h6>
                        <span className="badge bg-success">An toàn nhất</span>
                      </div>
                      <p className="text-muted small mb-2">
                        Cọc phí ship, thanh toán khi nhận hàng
                      </p>
                    </div>

                    <div className="payment-breakdown">
                      <div className="breakdown-item">
                        <span>Cần thanh toán ngay:</span>
                        <strong className="text-primary">
                          {shippingFee.toLocaleString()}₫
                        </strong>
                        <small className="text-muted d-block">
                          Phí vận chuyển
                        </small>
                      </div>
                      <div className="breakdown-item">
                        <span>COD khi nhận hàng:</span>
                        <strong className="text-danger">
                          {getFinalAmount().toLocaleString()}₫
                        </strong>
                        <small className="text-muted d-block">
                          Giá trị sản phẩm
                        </small>
                      </div>
                    </div>

                    <div className="benefits-list">
                      <div className="benefit-item">
                        <i className="bi bi-shield-check text-success me-2"></i>
                        <span>Kiểm tra hàng trước thanh toán</span>
                      </div>
                      <div className="benefit-item">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Chỉ cọc phí ship</span>
                      </div>
                      <div className="benefit-item">
                        <i className="bi bi-truck text-primary me-2"></i>
                        <span>Có bảo hiểm vận chuyển</span>
                      </div>
                      <div className="benefit-item">
                        <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                        <span>Mất cọc nếu không nhận hàng</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className={`payment-option ${
                      paymentMethod === "full_escrow" ? "selected" : ""
                    }`}
                    onClick={() => handlePaymentMethodChange("full_escrow")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="payment-header">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-1">Thanh toán trước 100%</h6>
                        <span className="badge bg-info">Nhanh chóng</span>
                      </div>
                      <p className="text-muted small mb-2">
                        Thanh toán trước, shipper giao không thu tiền
                      </p>
                    </div>

                    <div className="payment-breakdown">
                      <div className="breakdown-item">
                        <span>Cần thanh toán ngay:</span>
                        <strong className="text-primary">
                          {(
                            getFinalAmount() +
                            shippingFee +
                            platformFee
                          ).toLocaleString()}
                          ₫
                        </strong>
                        <small className="text-muted d-block">
                          Tổng đơn hàng + phí
                        </small>
                      </div>
                      <div className="breakdown-item">
                        <span>COD khi nhận hàng:</span>
                        <strong className="text-success">0₫</strong>
                        <small className="text-muted d-block">
                          Đã thanh toán trước
                        </small>
                      </div>
                    </div>

                    <div className="benefits-list">
                      <div className="benefit-item">
                        <i className="bi bi-lightning text-warning me-2"></i>
                        <span>Giao hàng nhanh không chờ COD</span>
                      </div>
                      <div className="benefit-item">
                        <i className="bi bi-clock text-info me-2"></i>
                        <span>Có thời gian kiểm tra hàng</span>
                      </div>
                      <div className="benefit-item">
                        <i className="bi bi-headset text-primary me-2"></i>
                        <span>Hỗ trợ hoàn tiền nếu có lỗi</span>
                      </div>
                      <div className="benefit-item">
                        <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                        <span>Phải thanh toán trước toàn bộ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Payment Gateway */}
          {showPaymentGateway && paymentMethod !== "direct" && (
            <div className="payment-gateway mt-4">
              <h6 className="mb-3">
                <i className="bi bi-wallet2 me-2"></i>
                Chọn phương thức thanh toán {depositAmount.toLocaleString()}₫
              </h6>
              <div className="row g-2">
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-primary w-100 payment-gateway-btn">
                    <img
                      src="/images/momo-logo.png"
                      alt="MoMo"
                      className="gateway-logo"
                    />
                    <span>MoMo</span>
                  </button>
                </div>
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-primary w-100 payment-gateway-btn">
                    <img
                      src="/images/zalopay-logo.png"
                      alt="ZaloPay"
                      className="gateway-logo"
                    />
                    <span>ZaloPay</span>
                  </button>
                </div>
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-primary w-100 payment-gateway-btn">
                    <i className="bi bi-bank text-primary"></i>
                    <span>Banking</span>
                  </button>
                </div>
                <div className="col-md-3 col-6">
                  <button className="btn btn-outline-primary w-100 payment-gateway-btn">
                    <i className="bi bi-credit-card text-info"></i>
                    <span>VNPay</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="order-summary">
            <div className="summary-row">
              <span>Tổng tiền hàng</span>
              <span>{getTotalAmount().toLocaleString()}₫</span>
            </div>

            <div className="summary-row">
              <span>Voucher Giảm Giá</span>
              <span className="text-danger">
                - {voucherDiscount.toLocaleString()}₫
              </span>
            </div>

            {shippingMethod !== "direct" && (
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()}₫</span>
              </div>
            )}

            {platformFee > 0 && (
              <div className="summary-row">
                <span>Phí dịch vụ (2%)</span>
                <span>{platformFee.toLocaleString()}₫</span>
              </div>
            )}

            <hr className="my-3" />

            {paymentMethod === "direct" ? (
              <div className="summary-row total-row">
                <span>Thanh toán khi gặp mặt</span>
                <span className="text-success fw-bold">
                  {getFinalAmount().toLocaleString()}₫
                </span>
              </div>
            ) : paymentMethod === "partial_escrow" ? (
              <>
                <div className="summary-row highlight">
                  <span>Cần thanh toán ngay</span>
                  <span className="text-primary fw-bold">
                    {depositAmount.toLocaleString()}₫
                  </span>
                </div>
                <div className="summary-row">
                  <span>COD khi nhận hàng</span>
                  <span className="text-danger fw-bold">
                    {getFinalAmount().toLocaleString()}₫
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="summary-row highlight">
                  <span>Cần thanh toán ngay</span>
                  <span className="text-primary fw-bold">
                    {depositAmount.toLocaleString()}₫
                  </span>
                </div>
                <div className="summary-row">
                  <span>COD khi nhận hàng</span>
                  <span className="text-success fw-bold">0₫</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="card-footer">
          <label className="form-check-label" htmlFor="agreementCheck">
            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <span className="text-primary">Điều khoản eco-market</span>
          </label>
          <Button
            className="btn btn-danger float-end mb-2"
            onClick={handlePlaceOrder}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
