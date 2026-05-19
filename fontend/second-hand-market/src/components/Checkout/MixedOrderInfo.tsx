import React from "react";
import {
  Paper,
  Box,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  HandshakeOutlined,
  LocalShippingOutlined,
  InfoOutlined,
  CheckCircleOutlined,
} from "@mui/icons-material";
import { MixedOrderInfoProps } from "./types/Checkout.types";

const MixedOrderInfo: React.FC<MixedOrderInfoProps> = ({ directMeetingCount, codShippingCount, bankTransferCount }) => {
  const hasDirectMeeting = directMeetingCount > 0;
  const hasCodShipping = codShippingCount > 0;
  const hasBankTransfer = bankTransferCount > 0;
  const totalOrders = directMeetingCount + codShippingCount + bankTransferCount;

  // Don't show if only one type of order
  if (totalOrders <= 1 || (!hasDirectMeeting && !hasCodShipping && !hasBankTransfer)) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "primary.main",
        backgroundColor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <InfoOutlined sx={{ color: "primary.main", mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="600" color="primary.main">
          Thông tin đơn hàng đa dạng
        </Typography>
      </Box>

      <Alert 
        severity="info" 
        variant="filled" 
        sx={{ 
          mb: 2, 
          bgcolor: "primary.light",
          color: "primary.contrastText",
          "& .MuiAlert-icon": {
            color: "primary.contrastText"
          }
        }}
      >
        <Typography variant="body2" fontWeight="500">
          Bạn có <strong>{totalOrders} đơn hàng</strong> với các phương thức giao dịch khác nhau. 
          Mỗi đơn hàng sẽ được xử lý theo phương thức tương ứng.
        </Typography>
      </Alert>

      <List disablePadding>
        {hasDirectMeeting && (
          <>
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <HandshakeOutlined color="success" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="600" color="text.primary">
                    {directMeetingCount} đơn giao dịch trực tiếp
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Bạn sẽ gặp mặt người bán để nhận hàng và thanh toán
                  </Typography>
                }
              />
            </ListItem>
            {(hasCodShipping || hasBankTransfer) && <Divider />}
          </>
        )}

        {hasCodShipping && (
          <>
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LocalShippingOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="600" color="text.primary">
                    {codShippingCount} đơn vận chuyển COD
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Hàng sẽ được ship đến địa chỉ, thanh toán khi nhận hàng
                  </Typography>
                }
              />
            </ListItem>
            {hasBankTransfer && <Divider />}
          </>
        )}

        {hasBankTransfer && (
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CheckCircleOutlined color="warning" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  {bankTransferCount} đơn chuyển khoản
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Thanh toán trước qua chuyển khoản, sau đó ship hàng
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>

      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "grey.300" }}>
        <Typography variant="body2" color="text.primary" sx={{ fontStyle: "italic", fontWeight: "500" }}>
          💡 Mẹo: Phương thức thanh toán bên dưới chỉ áp dụng cho các đơn hàng có vận chuyển.
        </Typography>
      </Box>
    </Paper>
  );
};

export default MixedOrderInfo; 