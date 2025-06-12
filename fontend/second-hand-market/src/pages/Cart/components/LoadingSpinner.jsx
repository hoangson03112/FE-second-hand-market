import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 