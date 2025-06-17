import React from "react";
import { Box, Typography, Avatar, Alert } from "@mui/material";
import { Phone, Security, Verified } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { Fade, Zoom } from "@mui/material";
import PhoneVerification from "../../../components/PhoneVerification/PhoneVerification";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const StyledCard = styled(Box)(({ theme }) => ({
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

const PhoneVerificationStep = ({
  currentUser,
  isPhoneVerified,
  onVerified,
}) => {
  return (
    <Fade in timeout={600}>
      <StyledCard>
        <Box sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <FloatingAvatar
              sx={{
                bgcolor: "#2a3b4c",
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              <Phone />
            </FloatingAvatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Xác minh số điện thoại
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bảo mật tài khoản với xác thực 2 lớp
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <Security sx={{ color: "success.main", fontSize: 32 }} />
            </Box>
          </Box>

          <PhoneVerification
            phone={currentUser?.phoneNumber}
            onVerified={onVerified}
          />

          {isPhoneVerified && (
            <Zoom in timeout={500}>
              <Alert
                severity="success"
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
                  border: "1px solid rgba(76, 175, 80, 0.2)",
                }}
                icon={<Verified />}
              >
                <Typography variant="body1" fontWeight="medium">
                  🎉 Số điện thoại đã được xác minh thành công!
                </Typography>
              </Alert>
            </Zoom>
          )}
        </Box>
      </StyledCard>
    </Fade>
  );
};

export default PhoneVerificationStep;
