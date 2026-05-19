import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  LocalShipping,
  AccessTime,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { ShippingMethodSelectorProps } from "./types/PaymentSummary.types";

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  shopName,
  services,
  selectedService,
  onServiceChange,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={20} />
            <Typography>Đang tính phí vận chuyển...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Alert severity="warning" icon={<Warning />}>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Alert severity="info">
            <Typography variant="body2">
              Không có phương thức vận chuyển khả dụng cho shop này.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getServiceIcon = (serviceCode: string | number) => {
    const iconMap: Record<string | number, string> = {
      "direct-meeting": "👥",
      "ship-cod": "🚚",
      53322: "🚚", // Standard
      53321: "⚡", // Express
      100039: "⏰", // Economy
    };
    return iconMap[serviceCode] || "🚚";
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Chọn phương thức vận chuyển
          </Typography>
        </Box>

        <RadioGroup
          value={selectedService?.code || ""}
          onChange={(e) => {
            const service = services.find((s) => s.code === e.target.value);
            if (service) {
              onServiceChange(service);
            }
          }}
        >
          {services.map((service) => (
            <Box key={service.code} sx={{ mb: 2 }}>
              <FormControlLabel
                value={service.code}
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6">
                      {getServiceIcon(service.code)}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        {formatPrice(service.fee)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <AccessTime
                          sx={{ fontSize: 14, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {service.estimatedTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                }
                sx={{
                  width: "100%",
                  margin: 0,
                  padding: 2,
                  border: "1px solid",
                  borderColor:
                    selectedService?.code === service.code
                      ? "primary.main"
                      : "divider",
                  borderRadius: 2,
                  backgroundColor:
                    selectedService?.code === service.code
                      ? "primary.50"
                      : "transparent",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              />
            </Box>
          ))}
        </RadioGroup>

        {selectedService && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "success.50", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CheckCircle color="success" />
              <Typography
                variant="body2"
                fontWeight="medium"
                color="success.main"
              >
                Đã chọn: {selectedService.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Phí vận chuyển: {formatPrice(selectedService.fee)} | Thời gian:{" "}
              {selectedService.estimatedTime}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingMethodSelector;
