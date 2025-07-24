import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Payment,
  CheckCircle,
  Phone,
  LocalOffer,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { useAuth } from "../../contexts/AuthContext";
import SellerContext from "../../contexts/SellerContext";
import { useNotification } from "../../hooks/useNotification";
// Import components
import StepperComponent from "./components/StepperComponent";
import PhoneVerificationStep from "./components/PhoneVerificationStep";
import PersonalInfoStep from "./components/PersonalInfoStep";
import PaymentInfoStep from "./components/PaymentInfoStep";
import ConfirmationStep from "./components/ConfirmationStep";
import { useNavigate } from "react-router-dom";

// Animations
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(63, 81, 181, 0); }
  100% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0); }
`;

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 32px 64px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background:
      "linear-gradient(90deg, #667eea 0%, #764ba2 25%, #667eea 50%, #f093fb 75%, #667eea 100%)",
    backgroundSize: "400% 100%",
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
  color: "white",
  padding: theme.spacing(6),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
    animation: `${shimmer} 4s ease-in-out infinite`,
    transform: "rotate(45deg)",
  },
}));

const PulseButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 32px",
  fontSize: "1.1rem",
  background: "linear-gradient(to right, #2a3b4c, #344960, #3e5871)",
  "&:hover": {
    background: "linear-gradient(to right, #344960, #3e5871, #496883)",
    animation: `${pulse} 1.5s infinite`,
  },
}));

// Steps configuration
const steps = [
  { label: "Xác minh số điện thoại", icon: <Phone />, color: "#2a3b4c" },
  { label: "Thông tin cá nhân", icon: <Person />, color: "#344960" },
  { label: "Thông tin thanh toán", icon: <Payment />, color: "#3e5871" },
  { label: "Xác nhận", icon: <CheckCircle />, color: "#496883" },
];

export default function RegisterSeller() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    avatar: null,
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    province_id: "",
    from_district_id: "",
    from_ward_code: "",
    idCardFront: null,
    idCardBack: null,
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    agreeTerms: false,
    agreePolicy: false,
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, showInfo } = useNotification();

  const banks = [
    "Vietcombank",
    "Techcombank",
    "BIDV",
    "VietinBank",
    "Agribank",
    "MB Bank",
  ];

  const handleInputChange = (field, value) => {
    if (field === "province") {
      setFormData((prev) => ({
        ...prev,
        province: value.ProvinceName,
        province_id: value.ProvinceID,
        district: "",
        ward: "",
        from_district_id: "",
        from_ward_code: "",
      }));
      return;
    }
    if (field === "district") {
      setFormData((prev) => ({
        ...prev,
        district: value.DistrictName,
        from_district_id: value.DistrictID,
        ward: "",
        from_ward_code: "",
      }));
      return;
    }
    if (field === "ward") {
      setFormData((prev) => ({
        ...prev,
        ward: value.WardName,
        from_ward_code: value.WardCode,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation functions for each step
  const validateStep = (step) => {
    switch (step) {
      case 0: // Phone verification
        return isPhoneVerified;
      case 1: // Personal information
        return (
          formData.avatar !== null &&
          formData.address.trim() !== "" &&
          formData.province !== "" &&
          formData.district !== "" &&
          formData.ward !== "" &&
          formData.idCardFront !== null &&
          formData.idCardBack !== null
        );
      case 2: // Payment information
        return (
          formData.bankName !== "" &&
          formData.accountNumber.trim() !== "" &&
          formData.accountHolder.trim() !== ""
        );
      case 3: // Confirmation
        return formData.agreeTerms && formData.agreePolicy;
      default:
        return false;
    }
  };

  const getStepErrors = (step) => {
    const errors = [];
    switch (step) {
      case 1:
        if (!formData.avatar) errors.push("Chưa tải lên ảnh đại diện");
        if (!formData.address.trim()) errors.push("Chưa nhập địa chỉ lấy hàng");
        if (!formData.province) errors.push("Chưa chọn tỉnh/thành phố");
        if (!formData.district) errors.push("Chưa chọn quận/huyện");
        if (!formData.ward) errors.push("Chưa chọn phường/xã");
        if (!formData.idCardFront)
          errors.push("Chưa tải lên ảnh CCCD mặt trước");
        if (!formData.idCardBack) errors.push("Chưa tải lên ảnh CCCD mặt sau");
        break;
      case 2:
        if (!formData.bankName) errors.push("Chưa chọn ngân hàng");
        if (!formData.accountNumber.trim())
          errors.push("Chưa nhập số tài khoản");
        if (!formData.accountHolder.trim())
          errors.push("Chưa nhập tên chủ tài khoản");
        break;
      case 3:
        if (!formData.agreeTerms)
          errors.push("Chưa đồng ý với điều khoản sử dụng");
        if (!formData.agreePolicy)
          errors.push("Chưa đồng ý với chính sách bảo mật");
        break;
      default:
        break;
    }
    return errors;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    showInfo("Đang xử lý đăng ký...", 0);

    try {
      const response = await SellerContext.registerSeller(formData);

      if (response.success) {
        showSuccess(response.message, 3000);

        setTimeout(() => {
          navigate("/eco-market/home");
          setActiveStep(0);
          setFormData({
            avatar: null,
            phone: "",
            address: "",
            province: "",
            district: "",
            ward: "",
            province_id: "",
            from_district_id: "",
            from_ward_code: "",
            idCardFront: null,
            idCardBack: null,
            bankName: "",
            accountNumber: "",
            accountHolder: "",
            agreeTerms: false,
            agreePolicy: false,
          });
          setIsPhoneVerified(false);
        }, 2000);
      } else {
        showError(response.message, 7000);
      }
    } catch (error) {
      console.error("Error registering seller:", error);
      showError(
        "❌ Đăng ký thất bại! Vui lòng kiểm tra kết nối mạng và thử lại.",
        7000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PhoneVerificationStep
            currentUser={currentUser}
            isPhoneVerified={isPhoneVerified}
            onVerified={() => {
              setIsPhoneVerified(true);
              setActiveStep(1);
            }}
          />
        );

      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            validateStep={validateStep}
            getStepErrors={getStepErrors}
            stepIndex={1}
          />
        );

      case 2:
        return (
          <PaymentInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            banks={banks}
            validateStep={validateStep}
            getStepErrors={getStepErrors}
            stepIndex={2}
          />
        );

      case 3:
        return (
          <ConfirmationStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
        py: 4,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <StyledPaper>
          {/* Enhanced Header */}
          <HeaderBox>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{ position: "relative", zIndex: 2 }}
            >
              🚀 Đăng ký người bán
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.95, position: "relative", zIndex: 2 }}
            >
              Tham gia cộng đồng mua bán đồ cũ và bắt đầu kinh doanh ngay hôm
              nay
            </Typography>
            <Box sx={{ mt: 3, position: "relative", zIndex: 2 }}>
              <LocalOffer sx={{ mr: 1, verticalAlign: "middle" }} />
              <Typography variant="body1" component="span">
                Miễn phí 100% - Không phí ẩn
              </Typography>
            </Box>
          </HeaderBox>

          {/* Stepper */}
          <StepperComponent steps={steps} activeStep={activeStep} />

          {/* Content */}
          <Box sx={{ p: 4 }}>{renderStepContent(activeStep)}</Box>

          {/* Enhanced Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 4,
              background: "linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)",
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                borderColor: "#667eea",
                color: "#667eea",
                "&:hover": {
                  borderColor: "#5a6fd8",
                  backgroundColor: "rgba(102, 126, 234, 0.04)",
                },
              }}
            >
              ← Quay lại
            </Button>

            {activeStep === steps.length - 1 ? (
              <PulseButton
                onClick={handleSubmit}
                disabled={!validateStep(3) || isSubmitting}
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  position: "relative",
                  opacity: !validateStep(3) || isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "white",
                        mr: 1,
                      }}
                    />
                    Đang xử lý...
                  </>
                ) : (
                  "🎉 Hoàn tất đăng ký"
                )}
              </PulseButton>
            ) : (
              <PulseButton
                onClick={handleNext}
                disabled={!validateStep(activeStep)}
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  opacity: validateStep(activeStep) ? 1 : 0.6,
                }}
              >
                {activeStep === 0 ? "Tiếp tục →" : "Lưu & Tiếp tục →"}
              </PulseButton>
            )}
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
}
