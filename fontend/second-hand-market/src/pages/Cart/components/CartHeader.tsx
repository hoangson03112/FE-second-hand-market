import React from 'react';
import { TABLE_COLUMNS } from '../constants';

const CartHeader = ({ isAllSelected, onSelectAll }) => {
  return (
    <thead>
      <tr className="text-center bg-light text-nowrap">
        <th style={TABLE_COLUMNS.CHECKBOX}>
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onSelectAll}
            />
            <span className="checkmark" />
            Tất cả
          </label>
        </th>
        <th style={TABLE_COLUMNS.PRODUCT}>Sản Phẩm</th>
        <th style={TABLE_COLUMNS.PRICE}>Đơn Giá</th>
        <th style={TABLE_COLUMNS.QUANTITY}>Số Lượng</th>
        <th style={TABLE_COLUMNS.TOTAL}>Thành Tiền</th>
        <th style={TABLE_COLUMNS.ACTION}></th>
      </tr>
    </thead>
  );
};

export default CartHeader; 