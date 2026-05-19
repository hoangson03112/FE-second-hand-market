import React from "react";
import { Box, Stack, Fab, Zoom, useTheme } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";

const ScrollToTopButton = ({ show }) => {
  const theme = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000 }}>
      <Stack spacing={2}>
        {/* Scroll to Top Button */}
        <Zoom in={show}>
          <Fab
            color="primary"
            size="medium"
            onClick={scrollToTop}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                transform: "scale(1.1)",
              },
            }}
          >
            <ArrowUpward />
          </Fab>
        </Zoom>
      </Stack>
    </Box>
  );
};

export default ScrollToTopButton;
