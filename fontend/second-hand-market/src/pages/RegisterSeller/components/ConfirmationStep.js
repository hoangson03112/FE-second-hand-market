import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Alert,
  Checkbox,
  FormControlLabel,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Person,
  Payment,
  PhotoCamera,
  Warning,
  Gavel,
  Security,
  Close,
  OpenInNew,
  VerifiedUser,
  CheckCircleOutline,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { Fade } from "@mui/material";

// Animations
const checkAnimation = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const successGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
  100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
}));

// Styled Components for Terms
const TermsContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  background: "linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)",
  border: "1px solid rgba(52, 73, 96, 0.1)",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #2a3b4c 0%, #344960 50%, #3e5871 100%)",
  },
}));

const TermCard = styled(Card)(({ theme, checked }) => ({
  borderRadius: 12,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  border: `2px solid ${checked ? "#28a745" : "rgba(52, 73, 96, 0.1)"}`,
  background: checked 
    ? "linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: checked
      ? "0 8px 25px rgba(40, 167, 69, 0.2)"
      : "0 8px 25px rgba(52, 73, 96, 0.15)",
    borderColor: checked ? "#28a745" : "#344960",
  },
  ...(checked && {
    animation: `${successGlow} 0.6s ease-out`,
  }),
}));

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: 0,
  "& .MuiSvgIcon-root": {
    fontSize: 28,
    color: "#dee2e6",
    transition: "all 0.3s ease",
  },
  "&.Mui-checked .MuiSvgIcon-root": {
    color: "#28a745",
    animation: `${checkAnimation} 0.3s ease-out`,
  },
  "&:hover .MuiSvgIcon-root": {
    color: "#28a745",
  },
}));

const TermIcon = styled(Box)(({ theme, checked }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: checked
    ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
    : "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
  color: "white",
  transition: "all 0.3s ease",
  boxShadow: checked
    ? "0 4px 20px rgba(40, 167, 69, 0.3)"
    : "0 4px 20px rgba(108, 117, 125, 0.2)",
}));

const ConfirmationStep = ({ formData, onInputChange }) => {
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);

  const termsContent = `
    ĐIỀU KHOẢN SỬ DỤNG

    1. CHẤP NHẬN ĐIỀU KHOẢN
    Bằng việc đăng ký làm người bán, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định.

    2. NGHĨA VỤ CỦA NGƯỜI BÁN
    - Cung cấp thông tin chính xác và trung thực
    - Đảm bảo chất lượng sản phẩm như mô tả
    - Giao hàng đúng thời gian cam kết
    - Tuân thủ các quy định về an toàn thực phẩm

    3. CÁC HÀNH VI BỊ CẤM
    - Bán hàng giả, hàng lậu
    - Gian lận thông tin sản phẩm
    - Thao túng đánh giá, bình luận
    - Vi phạm quyền sở hữu trí tuệ

    4. CHÍNH SÁCH HỦY TÀI KHOẢN
    Chúng tôi có quyền khóa tài khoản nếu phát hiện vi phạm.
  `;

  const privacyContent = `
    CHÍNH SÁCH BẢO MẬT

    1. THU THẬP THÔNG TIN
    Chúng tôi thu thập thông tin cần thiết để xác minh danh tính và hỗ trợ giao dịch.

    2. SỬ DỤNG THÔNG TIN
    - Xác minh danh tính người bán
    - Xử lý thanh toán
    - Cải thiện dịch vụ
    - Liên lạc khi cần thiết

    3. BẢO VỆ THÔNG TIN
    - Mã hóa SSL 256-bit
    - Lưu trữ an toàn trên server
    - Không chia sẻ với bên thứ ba
    - Tuân thủ luật bảo vệ dữ liệu

    4. QUYỀN CỦA NGƯỜI DÙNG
    - Truy cập thông tin cá nhân
    - Yêu cầu chỉnh sửa
    - Yêu cầu xóa dữ liệu
  `;

  return (
    <Fade in timeout={600}>
      <Box>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
              background: "linear-gradient(135deg, #2a3b4c 0%, #344960 100%)",
              border: "3px solid rgba(42, 59, 76, 0.1)",
              boxShadow: "0 8px 20px rgba(42, 59, 76, 0.15)",
            }}
          >
            <CheckCircle sx={{ fontSize: 36, color: "white" }} />
          </Avatar>
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{ color: "#2a3b4c", mb: 2 }}
          >
            Xác nhận thông tin
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 500, mx: "auto", color: "#496883" }}
          >
            Vui lòng kiểm tra kỹ thông tin bên dưới trước khi hoàn tất đăng ký
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Personal Info Card */}
          <Grid item xs={12} md={6}>
            <StyledCard elevation={0}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={4}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #2a3b4c 0%, #344960 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <Person sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="600" color="#2a3b4c">
                    Thông tin cá nhân
                  </Typography>
                </Box>

                <Box textAlign="center" mb={4}>
                  {formData.avatar ? (
                    <Avatar
                      src={URL.createObjectURL(formData.avatar)}
                      sx={{ width: 80, height: 80, mx: "auto" }}
                    />
                  ) : (
                    <Avatar sx={{ width: 80, height: 80, mx: "auto" }}>
                      <PhotoCamera />
                    </Avatar>
                  )}
                </Box>

                <Box sx={{ p: 3, borderRadius: 2, bgcolor: "#f8faff" }}>
                  <Typography variant="body2" color="#496883" gutterBottom>
                    Địa chỉ lấy hàng
                  </Typography>
                  <Typography variant="body1" fontWeight="500" color="#2a3b4c">
                    {formData.address}, {formData.ward}, {formData.district},{" "}
                    {formData.province}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Payment Info Card */}
          <Grid item xs={12} md={6}>
            <StyledCard elevation={0}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={4}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #3e5871 0%, #496883 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <Payment sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="600" color="#2a3b4c">
                    Thông tin thanh toán
                  </Typography>
                </Box>

                <Box sx={{ p: 3, borderRadius: 2, bgcolor: "#f8faff" }}>
                  <Typography variant="body2" color="#496883" gutterBottom>
                    Ngân hàng: {formData.bankName}
                  </Typography>
                  <Typography variant="body2" color="#496883" gutterBottom>
                    Số tài khoản: {formData.accountNumber}
                  </Typography>
                  <Typography variant="body2" color="#496883">
                    Chủ tài khoản: {formData.accountHolder}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Enhanced Terms & Conditions */}
        <TermsContainer elevation={0} sx={{ mt: 4, p: 4 }}>
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2a3b4c 0%, #344960 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 8px 20px rgba(42, 59, 76, 0.2)",
              }}
            >
              <VerifiedUser sx={{ fontSize: 28, color: "white" }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight="600"
              color="#2a3b4c"
              gutterBottom
            >
              Điều khoản & Chính sách
            </Typography>
            <Typography variant="body2" color="#496883">
              Vui lòng đọc và đồng ý với các điều khoản dưới đây
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Terms of Service */}
            <Grid item xs={12} md={6}>
              <TermCard 
                elevation={0} 
                checked={formData.agreeTerms}
                onClick={() => onInputChange("agreeTerms", !formData.agreeTerms)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <CustomCheckbox
                      checked={formData.agreeTerms}
                      icon={<CheckCircleOutline />}
                      checkedIcon={<CheckCircle />}
                      onChange={(e) => onInputChange("agreeTerms", e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <TermIcon checked={formData.agreeTerms} sx={{ mr: 2 }}>
                          <Gavel sx={{ fontSize: 24 }} />
                        </TermIcon>
                        <Box>
                          <Typography variant="h6" fontWeight="600" color="#2a3b4c">
                            Điều khoản sử dụng
                          </Typography>
                          <Typography variant="body2" color="#496883">
                            Quy định và trách nhiệm của người bán
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="#6c757d" mb={2}>
                        Cam kết tuân thủ các quy định về bán hàng, chất lượng sản phẩm 
                        và dịch vụ khách hàng.
                      </Typography>
                      
                      <Button
                        size="small"
                        startIcon={<OpenInNew />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenTermsModal(true);
                        }}
                        sx={{ color: "#344960" }}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </TermCard>
            </Grid>

            {/* Privacy Policy */}
            <Grid item xs={12} md={6}>
              <TermCard 
                elevation={0} 
                checked={formData.agreePolicy}
                onClick={() => onInputChange("agreePolicy", !formData.agreePolicy)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <CustomCheckbox
                      checked={formData.agreePolicy}
                      icon={<CheckCircleOutline />}
                      checkedIcon={<CheckCircle />}
                      onChange={(e) => onInputChange("agreePolicy", e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <TermIcon checked={formData.agreePolicy} sx={{ mr: 2 }}>
                          <Security sx={{ fontSize: 24 }} />
                        </TermIcon>
                        <Box>
                          <Typography variant="h6" fontWeight="600" color="#2a3b4c">
                            Chính sách bảo mật
                          </Typography>
                          <Typography variant="body2" color="#496883">
                            Bảo vệ thông tin cá nhân và dữ liệu
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="#6c757d" mb={2}>
                        Cam kết bảo mật thông tin cá nhân và không chia sẻ với 
                        bên thứ ba không được phép.
                      </Typography>
                      
                      <Button
                        size="small"
                        startIcon={<OpenInNew />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPrivacyModal(true);
                        }}
                        sx={{ color: "#344960" }}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </TermCard>
            </Grid>
          </Grid>

          {/* Success Message */}
          {formData.agreeTerms && formData.agreePolicy && (
            <Fade in timeout={600}>
              <Alert 
                severity="success" 
                sx={{ 
                  mt: 4,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)",
                  border: "1px solid #28a745",
                  "& .MuiAlert-icon": {
                    color: "#28a745"
                  }
                }}
                icon={<CheckCircle />}
              >
                <Typography variant="body1" fontWeight="500">
                  🎉 Tuyệt vời! Bạn đã sẵn sàng để hoàn tất đăng ký người bán
                </Typography>
              </Alert>
            </Fade>
          )}
        </TermsContainer>

        {/* Terms Modal */}
        <Dialog
          open={openTermsModal}
          onClose={() => setOpenTermsModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: "linear-gradient(135deg, #2a3b4c 0%, #344960 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Box display="flex" alignItems="center">
              <Gavel sx={{ mr: 2 }} />
              Điều khoản sử dụng
            </Box>
            <IconButton onClick={() => setOpenTermsModal(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
              {termsContent}
            </Typography>
          </DialogContent>
        </Dialog>

        {/* Privacy Modal */}
        <Dialog
          open={openPrivacyModal}
          onClose={() => setOpenPrivacyModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: "linear-gradient(135deg, #3e5871 0%, #496883 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <Box display="flex" alignItems="center">
              <Security sx={{ mr: 2 }} />
              Chính sách bảo mật
            </Box>
            <IconButton onClick={() => setOpenPrivacyModal(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
              {privacyContent}
            </Typography>
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ConfirmationStep;
