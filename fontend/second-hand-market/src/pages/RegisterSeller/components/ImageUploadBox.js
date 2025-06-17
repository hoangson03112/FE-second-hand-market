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

const ImageUploadBox = ({
  file,
  onFileSelect,
  title,
  description = "JPG, PNG. Tối đa 5MB",
  icon: Icon = PhotoCamera,
  avatarSize = { width: 80, height: 80 },
  gradient = "linear-gradient(to right, #2a3b4c, #344960)",
  accept = "image/*",
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

  return (
    <UploadBox onClick={handleClick} {...boxProps}>
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
      
      <Typography
        variant="h6"
        fontWeight="bold"
        color="primary"
        gutterBottom
      >
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
      
      {file && (
        <Typography variant="body2" color="success.main" mt={1}>
          ✅ {file.name}
        </Typography>
      )}
    </UploadBox>
  );
};

export default ImageUploadBox; 