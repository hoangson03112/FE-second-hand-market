import React from "react";
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
} from "@mui/material";
import {
  CheckCircle,
  Person,
  Payment,
  PhotoCamera,
  Warning,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Fade } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
}));

const ConfirmationStep = ({ formData, onInputChange }) => {
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

        {/* Terms & Conditions */}
        <StyledCard elevation={0} sx={{ mt: 4 }}>
          <CardContent sx={{ p: 5 }}>
            <Typography
              variant="h5"
              fontWeight="600"
              color="#2a3b4c"
              gutterBottom
              textAlign="center"
            >
              Điều khoản & Chính sách
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeTerms}
                      onChange={(e) =>
                        onInputChange("agreeTerms", e.target.checked)
                      }
                    />
                  }
                  label="Tôi đồng ý với điều khoản sử dụng"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreePolicy}
                      onChange={(e) =>
                        onInputChange("agreePolicy", e.target.checked)
                      }
                    />
                  }
                  label="Tôi đồng ý với chính sách bảo mật"
                />
              </Grid>
            </Grid>

            {formData.agreeTerms && formData.agreePolicy && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Tuyệt vời! Bạn đã sẵn sàng để hoàn tất đăng ký người bán
              </Alert>
            )}
          </CardContent>
        </StyledCard>
      </Box>
    </Fade>
  );
};

export default ConfirmationStep;
