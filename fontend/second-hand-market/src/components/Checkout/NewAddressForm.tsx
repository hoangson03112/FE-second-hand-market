import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Avatar,
  Divider,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Person,
  Phone,
  LocationOn,
  Navigation,
  Home,
  Add,
} from "@mui/icons-material";
import { LocationDropdownProps, NewAddressFormProps, Location } from "./types/Checkout.types";

const LocationDropdown: React.FC<LocationDropdownProps> = ({ locations, onSelect, show }) => {
  if (!show || !locations.length) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: 200,
        overflow: "auto",
        borderRadius: 2,
        mt: 1,
      }}
    >
      <List disablePadding>
        {locations.map((location: Location) => (
          <ListItemButton
            key={
              location.ProvinceID || location.DistrictID || location.WardCode
            }
            onMouseDown={() => onSelect(location)}
            sx={{
              "&:hover": {
                backgroundColor: "action.hover",
              },
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-child": {
                borderBottom: "none",
              },
            }}
          >
            <ListItemText
              primary={
                location.ProvinceName ||
                location.DistrictName ||
                location.WardName
              }
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: "medium",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

const NewAddressForm: React.FC<NewAddressFormProps> = ({
  newAddress,
  onAddressChange,
  onSelectProvince,
  onSelectDistrict,
  onSelectWard,
  onLocationFocus,
  onLocationBlur,
  filteredProvinces,
  filteredDistricts,
  filteredWards,
  showProvinceDropdown,
  showDistrictDropdown,
  showWardDropdown,
}) => {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
                mr: 2,
              }}
            >
              <Add />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Thêm địa chỉ mới
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Form */}
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ tên"
                name="fullName"
                value={newAddress.fullName}
                onChange={onAddressChange}
                placeholder="Nhập họ tên"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={newAddress.phoneNumber}
                onChange={onAddressChange}
                placeholder="Nhập số điện thoại"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Grid>

            {/* Location Fields */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Tỉnh/Thành"
                  name="province"
                  value={newAddress.province}
                  onChange={onAddressChange}
                  placeholder="Nhập tỉnh/thành..."
                  variant="outlined"
                  autoComplete="off"
                  onFocus={() => onLocationFocus("province")}
                  onBlur={() => onLocationBlur("province")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <LocationDropdown
                  locations={filteredProvinces}
                  onSelect={onSelectProvince}
                  show={showProvinceDropdown}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Quận/Huyện"
                  name="district"
                  value={newAddress.district}
                  onChange={onAddressChange}
                  placeholder="Nhập quận/huyện..."
                  variant="outlined"
                  autoComplete="off"
                  disabled={!newAddress.province}
                  onFocus={() => onLocationFocus("district")}
                  onBlur={() => onLocationBlur("district")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Navigation color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <LocationDropdown
                  locations={filteredDistricts}
                  onSelect={onSelectDistrict}
                  show={showDistrictDropdown}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Xã/Phường"
                  name="ward"
                  value={newAddress.ward}
                  onChange={onAddressChange}
                  placeholder="Nhập xã/phường..."
                  variant="outlined"
                  autoComplete="off"
                  disabled={!newAddress.district}
                  onFocus={() => onLocationFocus("ward")}
                  onBlur={() => onLocationBlur("ward")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <LocationDropdown
                  locations={filteredWards}
                  onSelect={onSelectWard}
                  show={showWardDropdown}
                />
              </Box>
            </Grid>

            {/* Specific Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ cụ thể"
                name="specificAddress"
                value={newAddress.specificAddress}
                onChange={onAddressChange}
                placeholder="Số nhà, tên đường..."
                variant="outlined"
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
            </Grid>

            {/* Default Address Checkbox */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={onAddressChange}
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" fontWeight="medium">
                      Đặt làm địa chỉ mặc định
                    </Typography>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewAddressForm;
