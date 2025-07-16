import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, Paper } from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentCancelPage = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const orderId = query.get("orderId");
  const code = query.get("code");
  const id = query.get("id");
  const cancel = query.get("cancel");
  const status = query.get("status");
  const orderCode = query.get("orderCode");

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Box mb={3}>
          <Typography variant="h4" color="error" fontWeight={700} gutterBottom>
            Thanh toán đã bị hủy
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Đơn hàng của bạn đã bị hủy hoặc thanh toán không thành công.
            <br />
            Nếu đây là nhầm lẫn, bạn có thể đặt lại đơn hàng hoặc liên hệ hỗ
            trợ.
          </Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1">
            <b>Mã đơn hàng:</b> {orderId || "-"}
          </Typography>
          <Typography variant="body1">
            <b>Mã giao dịch:</b> {id || "-"}
          </Typography>
          <Typography variant="body1">
            <b>Mã đơn PayOS:</b> {orderCode || "-"}
          </Typography>
          <Typography variant="body1">
            <b>Trạng thái:</b> {status || "-"}
          </Typography>
          <Typography variant="body1">
            <b>Mã code:</b> {code || "-"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/eco-market/customer/orders")}
        >
          Quay lại đơn hàng của tôi
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentCancelPage;
