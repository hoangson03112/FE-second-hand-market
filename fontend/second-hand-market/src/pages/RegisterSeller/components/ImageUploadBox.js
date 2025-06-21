import React, { useRef } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { PhotoCamera, Badge } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const successPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const UploadBox = styled(Box)(({ theme }) => ({
  border: "2px dashed #b0c5d9",
  borderRadius: 16,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  background: "linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)",
  transition: "all 0.3s ease",
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
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
    transition: "left 0.5s",
  },
  "&:hover": {
    borderColor: "#344960",
    background: "linear-gradient(135deg, #e8f2ff 0%, #dbe7fd 100%)",
    transform: "scale(1.02)",
    "&::before": {
      left: "100%",
    },
  },
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  border: "3px solid white",
}));

// ID Card container với tỷ lệ CCCD thật (85.6 x 53.98 mm = 1.6:1)
const IDCardContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 280, // Chiều rộng tối đa
  aspectRatio: "1.6/1", // Tỷ lệ CCCD
  borderRadius: 12, // Bo góc như CCCD thật
  border: "3px solid white",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  overflow: "hidden",
  margin: "0 auto 16px auto",
  animation: `${float} 3s ease-in-out infinite`,
  position: "relative",
  background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",

  // Overlay khi hover
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.05)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
  },

  "&:hover::after": {
    opacity: 1,
  },

  // Thêm hiệu ứng glow khi có ảnh
  "&.has-image": {
    boxShadow:
      "0 8px 32px rgba(52, 73, 96, 0.2), 0 0 0 1px rgba(52, 73, 96, 0.1)",
    animation: `${successPulse} 0.6s ease-out`,
    "&:hover": {
      boxShadow:
        "0 12px 40px rgba(52, 73, 96, 0.3), 0 0 0 1px rgba(52, 73, 96, 0.2)",
    },
  },
}));

// Placeholder cho ID Card
const IDCardPlaceholder = styled(Box)(({ theme, gradient }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  position: "relative",

  // Hiệu ứng shimmer
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    animation: `${shimmer} 2s infinite`,
  },

  // Thêm pattern giống CCCD
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
      radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px, 20px 20px, 10px 10px",
  },
}));

// Badge cho loại ảnh
const IDCardBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(4px)",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: "0.7rem",
  fontWeight: "bold",
  color: "#344960",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  zIndex: 2,
}));

const ImageUploadBox = ({
  file,
  onFileSelect,
  title,
  description = "JPG, PNG. Tối đa 5MB",
  icon: Icon = PhotoCamera,
  avatarSize = { width: 80, height: 80 },
  gradient = "linear-gradient(to right, #2a3b4c, #344960)",
  accept = "image/*",
  variant = "avatar", // "avatar" hoặc "idcard"
  ...boxProps
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const renderImageDisplay = () => {
    if (variant === "idcard") {
      return (
        <IDCardContainer className={file ? "has-image" : ""}>
          {file ? (
            <>
              <img
                src={URL.createObjectURL(file)}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "inherit",
                }}
              />
              <IDCardBadge>
                {title.includes("trước") ? "MẶT TRƯỚC" : "MẶT SAU"}
              </IDCardBadge>
            </>
          ) : (
            <IDCardPlaceholder gradient={gradient}>
              <Icon sx={{ fontSize: "2.5rem", mb: 1 }} />
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", textAlign: "center", px: 1 }}
              >
                {title.includes("trước") ? "MẶT TRƯỚC" : "MẶT SAU"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.65rem", opacity: 0.8, mt: 0.5 }}
              >
                CCCD/CMND
              </Typography>
            </IDCardPlaceholder>
          )}
        </IDCardContainer>
      );
    }

    // Default avatar variant
    return (
      <FloatingAvatar
        sx={{
          width: avatarSize.width,
          height: avatarSize.height,
          mx: "auto",
          mb: 2,
          background: gradient,
          fontSize: avatarSize.width > 100 ? "3rem" : "1.5rem",
        }}
      >
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <Icon fontSize="large" />
        )}
      </FloatingAvatar>
    );
  };

  return (
    <UploadBox
      onClick={handleClick}
      {...boxProps}
      sx={{
        ...(file &&
          variant !== "idcard" && {
            animation: `${successPulse} 0.6s ease-out`,
            borderColor: "#28a745",
            background: "linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)",
          }),
        ...boxProps.sx,
      }}
    >
      {renderImageDisplay()}

      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        {file ? `Thay đổi ${title}` : `Tải lên ${title}`}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </UploadBox>
  );
};

export default ImageUploadBox;
