import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  Alert,
} from "@mui/material";
import { Payment } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { Slide } from "@mui/material";
import ValidationErrorBox from "./ValidationErrorBox";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  border: "3px solid white",
}));

const PaymentInfoStep = ({
  formData,
  onInputChange,
  banks,
  validateStep,
  getStepErrors,
  stepIndex = 2,
}) => {
  return (
    <Slide direction="left" in timeout={600}>
      <StyledCard elevation={0}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={4}>
            <FloatingAvatar
              sx={{
                bgcolor: "#496883",
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              <Payment />
            </FloatingAvatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Thông tin thanh toán
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhận tiền từ việc bán hàng
              </Typography>
            </Box>
          </Box>

          <Alert
            severity="info"
            sx={{
              mb: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)",
              border: "1px solid rgba(33, 150, 243, 0.2)",
            }}
          >
            <Typography variant="body1">
              💰 Thông tin tài khoản ngân hàng để nhận thanh toán từ việc bán hàng
            </Typography>
          </Alert>

          <Box textAlign="center" mb={4}>
            <FloatingAvatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              <Payment fontSize="large" />
            </FloatingAvatar>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Thông tin thanh toán
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bảo mật và an toàn 100%
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Ngân hàng</InputLabel>
                <Select
                  value={formData.bankName}
                  label="Ngân hàng"
                  onChange={(e) => onInputChange("bankName", e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  {banks.map((bank) => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số tài khoản"
                required
                value={formData.accountNumber}
                onChange={(e) => onInputChange("accountNumber", e.target.value)}
                placeholder="1234567890"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover fieldset": {
                      borderColor: "#4facfe",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chủ tài khoản"
                required
                value={formData.accountHolder}
                onChange={(e) => onInputChange("accountHolder", e.target.value)}
                placeholder="Tên chủ tài khoản"
                helperText="📋 Tên chủ tài khoản phải trùng với tên đăng ký"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover fieldset": {
                      borderColor: "#4facfe",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Validation Errors */}
          <ValidationErrorBox 
            errors={!validateStep(stepIndex) ? getStepErrors(stepIndex) : []}
          />
        </CardContent>
      </StyledCard>
    </Slide>
  );
};

export default PaymentInfoStep; 