import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { ZoomOutMap } from "@mui/icons-material";

const ImageMessage = ({ attachment, setFullscreenImage }) => {
  const source = attachment.url || "";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box 
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        maxWidth: "100%",
        maxHeight: 240,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        mb: 0.5,
        cursor: "pointer",
        '&:hover .zoom-button': {
          opacity: 1,
        }
      }}
      onClick={() => setFullscreenImage(source)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        component="img"
        src={source}
        alt={attachment.name || "Image attachment"}
        loading="lazy"
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: 240,
          objectFit: "cover",
          display: "block",
          transition: "transform 0.2s",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
        }}
        onError={(e) => {
          console.error("Error loading image:", source);
          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
        }}
      />
      
      {isHovered && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.2s",
          }}
        />
      )}
      
      <IconButton 
        className="zoom-button"
        onClick={(e) => {
          e.stopPropagation();
          setFullscreenImage(source);
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#324155",
          color: "#fff",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s",
          width: 32,
          height: 32,
          '&:hover': {
            backgroundColor: "#455a74",
          }
        }}
        size="small"
      >
        <ZoomOutMap fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ImageMessage;
