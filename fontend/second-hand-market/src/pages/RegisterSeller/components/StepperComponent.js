import React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const GradientProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  background: "rgba(255,255,255,0.2)",
  "& .MuiLinearProgress-bar": {
    background: "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
    borderRadius: 4,
  },
}));

const StepperComponent = ({ steps, activeStep }) => {
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Enhanced Progress */}
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            Bước {activeStep + 1}/{steps.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progressPercentage)}% hoàn thành
          </Typography>
        </Box>
        <GradientProgress
          variant="determinate"
          value={progressPercentage}
        />
      </Box>

      {/* Enhanced Stepper */}
      <Box sx={{ p: 3 }}>
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          alternativeLabel
        >
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel
                icon={
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: index <= activeStep ? step.color : "grey.300",
                      color: "white",
                      transition: "all 0.3s ease",
                      transform: index === activeStep ? "scale(1.1)" : "scale(1)",
                      boxShadow:
                        index === activeStep
                          ? `0 0 20px ${step.color}40`
                          : "none",
                    }}
                  >
                    {index < activeStep ? <CheckCircle /> : step.icon}
                  </Avatar>
                }
              >
                <Typography
                  variant="body2"
                  fontWeight={index <= activeStep ? "bold" : "medium"}
                  color={
                    index <= activeStep ? "text.primary" : "text.secondary"
                  }
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
};

export default StepperComponent; 