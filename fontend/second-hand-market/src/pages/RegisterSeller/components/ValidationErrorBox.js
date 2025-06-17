import React from "react";
import { Box, Typography } from "@mui/material";

const ValidationErrorBox = ({ errors, title = "Vui lòng hoàn thành các thông tin sau:" }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          padding: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%)",
          border: "1px solid rgba(255, 152, 0, 0.2)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⚠️ {title}
        </Typography>
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {errors.map((error, index) => (
            <li key={index}>
              <Typography variant="body2">{error}</Typography>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default ValidationErrorBox; 