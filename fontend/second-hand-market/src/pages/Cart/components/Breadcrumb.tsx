import React from 'react';
import { CART_CONSTANTS } from '../constants';

const Breadcrumb = () => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb d-flex align-items-center pt-4">
        <li className="ms-3">
          <a
            href={CART_CONSTANTS.ROUTES.HOME}
            className="text-decoration-none text-primary-custom"
          >
            Trang chủ
          </a>
        </li>
        <li className="mx-2">
          <span>&nbsp;&gt;&nbsp;</span>
          Giỏ hàng
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb; 