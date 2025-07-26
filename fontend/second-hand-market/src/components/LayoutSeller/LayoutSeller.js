import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalCafe as LocalCafeIcon,
  ShoppingBasket as ShoppingBasketIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ExitToApp as ExitToAppIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { alpha } from "@mui/material/styles";
import AccountContext from "../../contexts/AccountContext";
import emitter from "../../utils/mitt";
const drawerWidth = 370;

const primaryColor = "#2e7d32"; // Màu xanh lá cho seller
const secondaryColor = "#81c784"; // Màu xanh lá nhạt

const LayoutSeller = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 960) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/eco-market/home");
  };
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      text: "Tổng quan",
      icon: <DashboardIcon />,
      path: "/eco-market/seller",
    },
    {
      text: "Sản phẩm",
      icon: <LocalCafeIcon />,
      path: "/eco-market/seller/products",
    },
    {
      text: "Đơn hàng",
      icon: <ShoppingBasketIcon />,
      path: "/eco-market/seller/orders",
    },
    {
      text: "Quản lý giảm giá",
      icon: <CardGiftcardIcon />,
      path: "/eco-market/seller/manage-discount",
    },
    // { text: "Thống kê doanh thu", icon: <BarChartIcon />, path: "/eco-market/seller/analytics" },
  ];

  const bottomMenuItems = [
    { text: "Trang chủ", icon: <ArrowBackIosIcon />, path: "/eco-market/home" },
    {
      text: "Đăng xuất",
      icon: <ExitToAppIcon />,
      path: "#",
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await AccountContext.Authentication();
        if (data) setAccount(data.data.account);
      } catch (error) {
        localStorage.clear();
        console.error("Error fetching", error);
      }
    };
    checkAuthentication();
    emitter.on("CART_UPDATED", checkAuthentication);
    return () => {
      emitter.off("CART_UPDATED", checkAuthentication);
    };
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: `${open ? drawerWidth : 0}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 3,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: primaryColor,
              "&:hover": {
                backgroundColor: alpha(primaryColor, 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              backgroundImage: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Quản Lý Gian Hàng
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Thông báo">
              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Cài đặt">
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Tài khoản">
              <IconButton
                sx={{
                  padding: 0.5,
                  border: "2px solid",
                  borderColor: alpha(primaryColor, 0.3),
                }}
              >
                <Avatar
                  alt="Seller User"
                  src="/images/avatar.jpg"
                  sx={{ width: 32, height: 32 }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        {loading && <LinearProgress color="success" />}
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: open ? "block" : "none",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
            background: `linear-gradient(to bottom, ${alpha(
              primaryColor,
              0.05
            )}, white)`,
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing(3, 1),
            ...theme.mixins.toolbar,
            color: "white",
            minHeight: 120,
          }}
        >
          <Box
            component="img"
            src="/images/logi.png"
            alt="Logo"
            sx={{
              height: 150,
              width: 190,
              objectFit: "contain",
              filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />

          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
                "&:hover": {
                  backgroundColor: alpha(primaryColor, 0.2),
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ mt: 2, px: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: alpha(secondaryColor, 0.05),
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              border: `1px solid ${alpha(secondaryColor, 0.2)}`,
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: secondaryColor,
                width: 40,
                height: 40,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <StoreIcon />
            </Avatar>

            <Box>
              <Typography variant="body2" fontWeight="bold">
                Xin chào, Seller {account?.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Người bán hàng
              </Typography>
            </Box>
          </Paper>
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  backgroundColor: isActive(item.path)
                    ? alpha(primaryColor, 0.15)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(primaryColor, 0.08),
                    transform: "translateX(5px)",
                    transition: "all 0.3s ease",
                  },
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                  pl: isActive(item.path) ? 3 : 2,
                  "&::before": isActive(item.path)
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        backgroundColor: primaryColor,
                        borderRadius: "0 4px 4px 0",
                      }
                    : {},
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? primaryColor
                      : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? "bold" : "medium",
                    color: isActive(item.path) ? primaryColor : "text.primary",
                    fontSize: 14,
                  }}
                />
                {isActive(item.path) && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: primaryColor,
                      ml: 1,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ mx: 2, backgroundColor: alpha(primaryColor, 0.1) }} />

        <List sx={{ px: 1 }}>
          {bottomMenuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={item.onClick ? "button" : Link}
                to={!item.onClick ? item.path : undefined}
                onClick={item.onClick}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor:
                      index === 1
                        ? alpha("#f44336", 0.08)
                        : alpha(primaryColor, 0.08),
                    transform: "translateX(5px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: index === 1 ? "#f44336" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: index === 1 ? "#f44336" : "text.primary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Phiên bản 2.1.0 © 2025 Eco-Market
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: theme.spacing(3),
          marginTop: "64px",
          minHeight: "100vh",
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          marginLeft: 0,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          bgcolor: alpha(primaryColor, 0.02),
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 3,
            minHeight: "calc(100vh - 100px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutSeller;
