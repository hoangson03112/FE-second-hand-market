import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NoAccess = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <Typography variant="h3" color="error" gutterBottom>
        Không có quyền truy cập
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/eco-market/home")}>Về trang chủ</Button>
    </Box>
  );
};

export default NoAccess;
