import React, { useEffect, useState } from "react";
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
  InputAdornment,
} from "@mui/material";
import { Person, Badge, Search } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { Slide } from "@mui/material";
import ImageUploadBox from "./ImageUploadBox";
import ValidationErrorBox from "./ValidationErrorBox";
import { useAddressManagement } from "../../../hooks/useAddressManagement";
import axios from "axios";

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
  validateStep,
  getStepErrors,
  stepIndex = 1,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_GHN_API_URL}/province`,
          {
            headers: { Token: process.env.REACT_APP_GHN_TOKEN },
          }
        );
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.province_id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_GHN_API_URL}/district`,
            {
              headers: { Token: process.env.REACT_APP_GHN_TOKEN },
              params: { province_id: formData.province_id },
            }
          );
          setDistricts(response.data.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      } else {
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [formData.province_id]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (formData.from_district_id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_GHN_API_URL}/ward`,
            {
              headers: { Token: process.env.REACT_APP_GHN_TOKEN },
              params: { district_id: formData.from_district_id },
            }
          );
          setWards(response.data.data);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      } else {
        setWards([]);
      }
    };

    fetchWards();
  }, [formData.from_district_id]);

  // Filter functions
  const filteredProvinces = provinces.filter((province) =>
    province.ProvinceName.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const filteredDistricts = districts.filter((district) =>
    district.DistrictName.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredWards = wards.filter((ward) =>
    ward.WardName.toLowerCase().includes(wardSearch.toLowerCase())
  );

  // Handle province change with search reset
  const handleProvinceChange = (e) => {
    onInputChange("province", e.target.value);
    setProvinceSearch(""); // Reset search
  };

  // Handle district change with search reset
  const handleDistrictChange = (e) => {
    onInputChange("district", e.target.value);
    setDistrictSearch(""); // Reset search
  };

  // Handle ward change with search reset
  const handleWardChange = (e) => {
    onInputChange("ward", e.target.value);
    setWardSearch(""); // Reset search
  };

  // Handle search input changes
  const handleProvinceSearchChange = (e) => {
    e.stopPropagation();
    setProvinceSearch(e.target.value);
  };

  const handleDistrictSearchChange = (e) => {
    e.stopPropagation();
    setDistrictSearch(e.target.value);
  };

  const handleWardSearchChange = (e) => {
    e.stopPropagation();
    setWardSearch(e.target.value);
  };

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
                <InputLabel>Thành phố/ Tỉnh</InputLabel>
                <Select
                  value={formData.province}
                  label="Thành phố/ Tỉnh"
                  onChange={handleProvinceChange}
                  sx={{ borderRadius: 3 }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem sx={{ p: 0 }} onClick={(e) => e.stopPropagation()}>
                    <TextField
                      fullWidth
                      placeholder="Tìm kiếm tỉnh/thành phố..."
                      value={provinceSearch}
                      onChange={handleProvinceSearchChange}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "#9ca3af", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                      sx={{
                        p: 1,
                        "& .MuiInputBase-input": {
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  </MenuItem>
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((province) => (
                      <MenuItem
                        key={province.ProvinceID}
                        value={province}
                        sx={{
                          fontSize: "0.875rem",
                          py: 0.5,
                        }}
                      >
                        {province.ProvinceName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem
                      disabled
                      sx={{ fontSize: "0.875rem", fontStyle: "italic" }}
                    >
                      Không tìm thấy tỉnh/thành phố
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select
                  value={formData.district}
                  label="Quận/Huyện"
                  onChange={handleDistrictChange}
                  sx={{ borderRadius: 3 }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem sx={{ p: 0 }} onClick={(e) => e.stopPropagation()}>
                    <TextField
                      fullWidth
                      placeholder="Tìm kiếm quận/huyện..."
                      value={districtSearch}
                      onChange={handleDistrictSearchChange}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "#9ca3af", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                      sx={{
                        p: 1,
                        "& .MuiInputBase-input": {
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  </MenuItem>
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((district) => (
                      <MenuItem
                        key={district.DistrictID}
                        value={district}
                        sx={{
                          fontSize: "0.875rem",
                          py: 0.5,
                        }}
                      >
                        {district.DistrictName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem
                      disabled
                      sx={{ fontSize: "0.875rem", fontStyle: "italic" }}
                    >
                      Không tìm thấy quận/huyện
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Phường/Xã</InputLabel>
                <Select
                  value={formData.ward}
                  label="Phường/Xã"
                  onChange={handleWardChange}
                  sx={{ borderRadius: 3 }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  <MenuItem sx={{ p: 0 }} onClick={(e) => e.stopPropagation()}>
                    <TextField
                      fullWidth
                      placeholder="Tìm kiếm phường/xã..."
                      value={wardSearch}
                      onChange={handleWardSearchChange}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "#9ca3af", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        disableUnderline: true,
                      }}
                      sx={{
                        p: 1,
                        "& .MuiInputBase-input": {
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  </MenuItem>
                  {filteredWards.length > 0 ? (
                    filteredWards.map((ward) => (
                      <MenuItem
                        key={ward.WardCode}
                        value={ward}
                        sx={{
                          fontSize: "0.875rem",
                          py: 0.5,
                        }}
                      >
                        {ward.WardName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem
                      disabled
                      sx={{ fontSize: "0.875rem", fontStyle: "italic" }}
                    >
                      Không tìm thấy phường/xã
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
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
