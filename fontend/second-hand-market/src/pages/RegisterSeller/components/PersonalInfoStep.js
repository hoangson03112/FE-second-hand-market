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
} from "@mui/material";
import { Person, Badge } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { Slide } from "@mui/material";
import ImageUploadBox from "./ImageUploadBox";
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

const PersonalInfoStep = ({
  formData,
  onInputChange,
  cities,
  validateStep,
  getStepErrors,
  stepIndex = 1,
}) => {
  return (
    <Slide direction="left" in timeout={600}>
      <StyledCard elevation={0}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={4}>
            <FloatingAvatar
              sx={{
                bgcolor: "#344960",
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              <Person />
            </FloatingAvatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Thông tin cá nhân
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Xây dựng hồ sơ của bạn
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Avatar Upload */}
            <Grid item xs={12}>
              <Box textAlign="center" mb={3}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.primary"
                  gutterBottom
                >
                  📸 Ảnh đại diện
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Tải lên ảnh đại diện để khách hàng dễ nhận biết
                </Typography>
              </Box>

              <ImageUploadBox
                file={formData.avatar}
                onFileSelect={(file) => onInputChange("avatar", file)}
                title="ảnh đại diện"
                avatarSize={{ width: 120, height: 120 }}
                gradient="linear-gradient(to right, #2a3b4c, #344960)"
                sx={{ maxWidth: 400, mx: "auto" }}
              />
            </Grid>

            {/* Địa chỉ lấy hàng */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ lấy hàng"
                required
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                placeholder="Số nhà, tên đường..."
                helperText="📍 Địa chỉ mà khách hàng có thể đến nhận hàng"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover fieldset": {
                      borderColor: "#344960",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Thành phố</InputLabel>
                <Select
                  value={formData.province}
                  label="Thành phố"
                  onChange={(e) => onInputChange("province", e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  {cities.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quận/Huyện"
                required
                value={formData.district}
                onChange={(e) => onInputChange("district", e.target.value)}
                placeholder="Quận/Huyện"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover fieldset": {
                      borderColor: "#344960",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phường/Xã"
                required
                value={formData.ward}
                onChange={(e) => onInputChange("ward", e.target.value)}
                placeholder="Phường/Xã"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover fieldset": {
                      borderColor: "#344960",
                    },
                  },
                }}
              />
            </Grid>

            {/* Ảnh CMND/CCCD */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                📄 Ảnh CMND/CCCD
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Vui lòng tải lên ảnh mặt trước và mặt sau CMND/CCCD rõ nét
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <ImageUploadBox
                file={formData.idCardFront}
                onFileSelect={(file) => onInputChange("idCardFront", file)}
                title="Mặt trước CMND/CCCD"
                icon={Badge}
                gradient="linear-gradient(to right, #2a3b4c, #344960)"
                variant="idcard"
                description="Ảnh rõ nét, JPG/PNG, tối đa 5MB"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ImageUploadBox
                file={formData.idCardBack}
                onFileSelect={(file) => onInputChange("idCardBack", file)}
                title="Mặt sau CMND/CCCD"
                icon={Badge}
                gradient="linear-gradient(to right, #344960, #3e5871)"
                variant="idcard"
                description="Ảnh rõ nét, JPG/PNG, tối đa 5MB"
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

export default PersonalInfoStep; 