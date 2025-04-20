import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Button.css';

const BackButton = ({ label = 'Quay lại', onClick, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={handleClick}
      className="back-button"
      {...props}
    >
      {label}
    </Button>
  );
};

export default BackButton;
