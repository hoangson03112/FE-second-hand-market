import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Alert, LinearProgress, Chip, Button } from "@mui/material";
import { Phone, Security, Verified, CheckCircle, Timer, ArrowForward } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { Fade, Zoom, Slide } from "@mui/material";
import PhoneVerification from "../../../components/PhoneVerification/PhoneVerification";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const successPulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const countdownPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
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

const SuccessAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 16,
  background: "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
  border: "2px solid #4caf50",
  animation: `${successPulse} 0.8s ease-out`,
  "& .MuiAlert-icon": {
    color: "#4caf50",
    fontSize: "2rem",
  },
  "& .MuiAlert-message": {
    width: "100%",
  },
}));

const CountdownChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
  color: "white",
  fontWeight: "bold",
  fontSize: "0.9rem",
  animation: `${countdownPulse} 1s ease-in-out infinite`,
  "& .MuiChip-icon": {
    color: "white",
  },
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
  "& .MuiLinearProgress-root": {
    borderRadius: 10,
    height: 8,
    background: "rgba(76, 175, 80, 0.1)",
  },
  "& .MuiLinearProgress-bar": {
    borderRadius: 10,
    background: "linear-gradient(90deg, #4caf50 0%, #45a049 100%)",
  },
}));

const SkipButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 16px",
  background: "linear-gradient(135deg, #2a3b4c 0%, #344960 100%)",
  color: "white",
  boxShadow: "0 4px 12px rgba(42, 59, 76, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #344960 0%, #3e5871 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 16px rgba(42, 59, 76, 0.4)",
  },
}));

const PhoneVerificationStep = ({
  currentUser,
  isPhoneVerified,
  onVerified,
}) => {
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let timer;
    if (isVerificationSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Gọi onVerified để chuyển sang bước tiếp theo
            onVerified();
            return 0;
          }
          return prev - 1;
        });
        
        // Update progress bar
        setProgress((prev) => prev - (100 / 3));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVerificationSuccess, countdown, onVerified]);

  const handleVerificationSuccess = () => {
    setIsVerificationSuccess(true);
    setCountdown(3);
    setProgress(100);
  };

  const handleSkipCountdown = () => {
    setCountdown(0);
    onVerified();
  };

  return (
    <Fade in timeout={600}>
      <StyledCard>
        <Box sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <FloatingAvatar
              sx={{
                bgcolor: isVerificationSuccess ? "#4caf50" : "#2a3b4c",
                mr: 2,
                width: 48,
                height: 48,
                transition: "all 0.3s ease",
              }}
            >
              {isVerificationSuccess ? <CheckCircle /> : <Phone />}
            </FloatingAvatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Xác minh số điện thoại
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isVerificationSuccess 
                  ? "Xác minh thành công! Đang chuyển sang bước tiếp theo..." 
                  : "Bảo mật tài khoản với xác thực 2 lớp"
                }
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              {isVerificationSuccess ? (
                <CountdownChip
                  icon={<Timer />}
                  label={`${countdown}s`}
                  size="medium"
                />
              ) : (
                <Security sx={{ color: "success.main", fontSize: 32 }} />
              )}
            </Box>
          </Box>

          {!isVerificationSuccess ? (
            <PhoneVerification
              phone={currentUser?.phoneNumber}
              onVerified={handleVerificationSuccess}
            />
          ) : (
            <Slide direction="up" in={isVerificationSuccess} timeout={500}>
              <Box>
                <SuccessAlert
                  severity="success"
                  icon={<Verified />}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      🎉 Xác minh thành công!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Số điện thoại <strong>{currentUser?.phoneNumber}</strong> đã được xác minh.
                      Bạn sẽ tự động chuyển sang bước tiếp theo.
                    </Typography>
                    
                    <ProgressContainer>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Tự động chuyển sau
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" color="success.main">
                          {countdown} giây
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress}
                        sx={{
                          transition: "all 1s linear",
                        }}
                      />
                    </ProgressContainer>

                    {/* Skip Button */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                      <SkipButton
                        onClick={handleSkipCountdown}
                        startIcon={<ArrowForward />}
                        size="medium"
                      >
                        Tiếp tục ngay
                      </SkipButton>
                    </Box>
                  </Box>
                </SuccessAlert>
              </Box>
            </Slide>
          )}

          {isPhoneVerified && !isVerificationSuccess && (
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
