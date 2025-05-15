import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import StoreIcon from "@mui/icons-material/Store";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../hooks/useCart";
import "./MainLayout.css";
import emitter from "../../../utils/mitt";
import { ChatBox } from "../../ChatBox/ChatBox";

/**
 * Component layout chính cho ứng dụng
 */
const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();
  const { cart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUserId, setChatUserId] = useState(null);

  // Kiểm tra đường dẫn hiện tại
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Các menu chính của ứng dụng
  const menuItems = [
    {
      text: "Trang chủ",
      icon: <HomeIcon />,
      path: "/eco-market/home",
      showAlways: true,
    },
    {
      text: "Danh mục",
      icon: <CategoryIcon />,
      path: "/eco-market",
      showAlways: true,
    },
    {
      text: "Giỏ hàng",
      icon: <ShoppingCartIcon />,
      path: "/eco-market/my-cart",
      showAlways: true,
      badge: cart.totalItems,
    },
    {
      text: "Đăng sản phẩm",
      icon: <AddBusinessIcon />,
      path: "/eco-market/seller/products/new",
      showWhenAuth: true,
    },
    {
      text: "Sản phẩm của tôi",
      icon: <StoreIcon />,
      path: "/eco-market/seller/products",
      showWhenAuth: true,
    },
    {
      text: "Tài khoản",
      icon: <AccountCircleIcon />,
      path: isAuthenticated ? "/eco-market/user/profile" : "/eco-market/login",
      showAlways: true,
    },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Tạo danh sách menu cho drawer
  const drawerList = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      className="drawer-container"
    >
      <Box className="drawer-header">
        <Typography variant="h6" className="drawer-title">
          Eco Market
        </Typography>
        {isAuthenticated && currentUser && (
          <Typography variant="body2" className="drawer-subtitle">
            Xin chào, {currentUser.name || currentUser.email}
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // Hiển thị menu dựa trên trạng thái đăng nhập
          if (
            (item.showWhenAuth && !isAuthenticated) ||
            (item.showWhenNotAuth && isAuthenticated)
          ) {
            return null;
          }

          if (
            item.showAlways ||
            (item.showWhenAuth && isAuthenticated) ||
            (item.showWhenNotAuth && !isAuthenticated)
          ) {
            return (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                className={isActive(item.path) ? "active-menu-item" : ""}
              >
                <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.badge > 0 && (
                  <Box className="menu-badge">{item.badge}</Box>
                )}
              </ListItem>
            );
          }
          return null;
        })}
      </List>
    </Box>
  );

  useEffect(() => {
    const openChat = (userId) => {
      setChatUserId(userId);
      setIsChatOpen(true);
    };
    emitter.on("OPEN_CHAT_WITH_USER", openChat);
    return () => emitter.off("OPEN_CHAT_WITH_USER", openChat);
  }, []);

  return (
    <Box className="layout-container">
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            className="menu-button"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/eco-market/home"
            className="app-title"
          >
            Eco Market
          </Typography>

          {!isMobile && (
            <Box className="desktop-menu">
              {menuItems.map((item) => {
                if (
                  (item.showWhenAuth && !isAuthenticated) ||
                  (item.showWhenNotAuth && isAuthenticated)
                ) {
                  return null;
                }

                if (
                  item.showAlways ||
                  (item.showWhenAuth && isAuthenticated) ||
                  (item.showWhenNotAuth && !isAuthenticated)
                ) {
                  return (
                    <Box
                      key={item.text}
                      component={Link}
                      to={item.path}
                      className={`menu-item ${
                        isActive(item.path) ? "active-menu-item" : ""
                      }`}
                    >
                      {item.icon}
                      <Typography variant="body2" className="menu-text">
                        {item.text}
                      </Typography>
                      {item.badge > 0 && (
                        <Box className="menu-badge">{item.badge}</Box>
                      )}
                    </Box>
                  );
                }
                return null;
              })}
            </Box>
          )}

          <Box className="toolbar-actions">
            <IconButton color="inherit" className="notification-button">
              <NotificationsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList()}
      </Drawer>

      <Box component="main" className="main-content">
        <Toolbar />
        <Container className="content-container">{children}</Container>
      </Box>
      <ChatBox
        isOpen={isChatOpen}
        toggleChat={() => setIsChatOpen(false)}
        initialUserId={chatUserId}
      />
    </Box>
  );
};

export default MainLayout;
