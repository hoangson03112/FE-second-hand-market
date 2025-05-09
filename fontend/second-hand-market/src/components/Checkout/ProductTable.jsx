import React from "react";

const ProductTable = ({ products, selectedItems }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="bg-light">
                <th className="fs-5 fw-normal text-start" style={{ width: "50%" }}>Sản phẩm</th>
                <th className="fs-6 fw-normal text-center" style={{ width: "15%" }}>Đơn giá</th>
                <th className="fs-6 fw-normal text-center" style={{ width: "10%" }}>Số lượng</th>
                <th className="fs-6 fw-normal text-danger text-center" style={{ width: "15%" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const item = selectedItems.find((item) => item.productId === product._id);
                return item ? (
                  <tr key={product._id}>
                    <td className="text-start">
                      <img
                        src={product.avatar}
                        alt={product.name}
                        className="img-fluid"
                        style={{ width: "80px", height: "100px", objectFit: "contain", display: "inline-block", verticalAlign: "middle" }}
                      />
                      <div className="ms-3" style={{ display: "inline-block", verticalAlign: "middle" }}>
                        <p className="mb-1 fw-bold">{product.name}</p>
                        <p className="text-muted mb-0">Loại: {product.brand} - {product.color}</p>
                      </div>
                    </td>
                    <td className="text-center">{product.price}₫</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center text-danger">{(item.quantity * product.price).toLocaleString()}₫</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductTable; 