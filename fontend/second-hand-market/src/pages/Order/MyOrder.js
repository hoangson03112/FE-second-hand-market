import React, { useEffect, useState } from "react";
import OrderItem from "../../components/specific/OrderItem";
import { useOrder } from "../../contexts/OrderContext";
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Divider,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styled tabs
const OrderTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.error.main,
    height: 3
  },
}));

const OrderTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  minWidth: 90,
  '&.Mui-selected': {
    color: theme.palette.error.main,
    fontWeight: 600
  },
  '&:hover': {
    color: theme.palette.error.main,
    opacity: 0.8
  }
}));

const OrderContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px'
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary
}));

const MyOrder = () => {
  const { getOrder } = useOrder();
  const [activeTab, setActiveTab] = useState("ALL");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xác nhận", value: "PENDING" },
    { label: "Đang vận chuyển", value: "SHIPPING" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELLED" },
    { label: "Trả hàng/Hoàn tiền", value: "REFUND" },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrder();
      setOrders(data.orders);
      setFilteredOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab === "ALL") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === activeTab);
      setFilteredOrders(filtered);
    }
  }, [activeTab, orders]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderOrders = () => {
    if (loading) {
      return (
        <EmptyStateContainer>
          <CircularProgress color="error" size={40} thickness={4} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Đang tải đơn hàng...
          </Typography>
        </EmptyStateContainer>
      );
    }

    if (filteredOrders?.length === 0) {
      return (
        <EmptyStateContainer>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Không có đơn hàng nào
          </Typography>
          <Typography variant="body2">
            Bạn chưa có đơn hàng nào{" "}
            {activeTab !== "ALL" ? "ở trạng thái này" : ""}
          </Typography>
        </EmptyStateContainer>
      );
    }

    return filteredOrders.map((order, index) => (
      <OrderContainer key={order._id || index}>
        <OrderItem order={order} setOrders={setOrders} />
      </OrderContainer>
    ));
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 2, boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px' }}>
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Đơn hàng của tôi
            </Typography>
            <OrderTabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {tabs.map((tab) => (
                <OrderTab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </OrderTabs>
          </Box>
        </Paper>

        <Box sx={{ minHeight: "60vh" }}>
          {renderOrders()}
        </Box>
      </Container>
    </Box>
  );
};

export default MyOrder;
