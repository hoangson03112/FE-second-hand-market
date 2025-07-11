import React from 'react';

const SellerSection = ({ seller }) => {
  return (
    <tr className="border-top mt-3">
      <td colSpan="6">
        <div className="d-flex align-items-center w-100 mb-2">
          <img
            src={seller?.avatar?.url}
            alt="Avatar"
            className="rounded-circle"
            width="50"
            height="50"
          />
          <span className="ms-3 fw-bold">
            {seller.fullName || "Loading..."}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default SellerSection; 