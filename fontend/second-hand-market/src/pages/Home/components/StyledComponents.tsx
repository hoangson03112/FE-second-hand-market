import { Box, Card, Button, styled } from "@mui/material";

// Enhanced Styled Components with Keyframes
export const HeroSection = styled(Box)(() => ({
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  borderRadius: "0 0 32px 32px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0.2) 30%,
        rgba(0, 0, 0, 0.1) 70%,
        rgba(0, 0, 0, 0.4) 100%
      )
    `,
    zIndex: 2,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 50%),
      linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)
    `,
    zIndex: 3,
    opacity: 0.8,
    animation: "subtleShimmer 8s ease-in-out infinite",
  },
  "@keyframes subtleShimmer": {
    "0%, 100%": {
      opacity: 0.8,
      transform: "translateX(0)",
    },
    "50%": {
      opacity: 1,
      transform: "translateX(10px)",
    },
  },
}));

export const GlassmorphismCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.5)",
    background: "rgba(255, 255, 255, 0.15)",
  },
}));

export const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
    animation: "shimmer 3s infinite",
  },
  "@keyframes shimmer": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
}));

export const ProductSection = styled(SectionBox)(({ theme }) => ({
  background: `linear-gradient(45deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.grey[50]} 100%
  )`,
}));

export const StatsSection = styled(SectionBox)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main} 0%, 
    ${theme.palette.primary.dark} 25%,
    ${theme.palette.secondary.main} 50%,
    ${theme.palette.secondary.dark} 75%,
    ${theme.palette.primary.main} 100%
  )`,
  backgroundSize: "400% 400%",
  animation: "gradientShift 8s ease infinite",
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.1,
  },
  "@keyframes gradientShift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));

export const EnhancedStatCard = styled(GlassmorphismCard)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    left: "100%",
  },
}));

export const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  borderRadius: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main,
  },
}));

export const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  color: "white",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    boxShadow: `0 8px 30px ${theme.palette.primary.main}60`,
    transform: "translateY(-2px)",
  },
}));
