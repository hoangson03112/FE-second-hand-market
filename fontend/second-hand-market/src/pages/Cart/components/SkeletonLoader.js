import React from 'react';
import { Table } from 'react-bootstrap';

const SkeletonItem = ({ width = '100%', height = '20px', borderRadius = '4px' }) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }}
  />
);

const CartSkeleton = ({ itemCount = 3 }) => {
  return (
    <div className="cart-skeleton">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      
      {/* Cart Header Skeleton */}
      <div className="mb-3">
        <SkeletonItem width="200px" height="32px" />
      </div>

      {/* Cart Table Skeleton */}
      <Table borderless className="table-hover">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>
              <SkeletonItem width="20px" height="20px" />
            </th>
            <th style={{ width: '45%' }}>
              <SkeletonItem width="80px" height="16px" />
            </th>
            <th style={{ width: '15%' }}>
              <SkeletonItem width="60px" height="16px" />
            </th>
            <th style={{ width: '15%' }}>
              <SkeletonItem width="70px" height="16px" />
            </th>
            <th style={{ width: '15%' }}>
              <SkeletonItem width="80px" height="16px" />
            </th>
            <th style={{ width: '5%' }}>
              <SkeletonItem width="30px" height="16px" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: itemCount }).map((_, index) => (
            <React.Fragment key={index}>
              {/* Seller Header */}
              <tr>
                <td colSpan="6" className="bg-light py-2">
                  <div className="d-flex align-items-center">
                    <SkeletonItem 
                      width="40px" 
                      height="40px" 
                      borderRadius="50%" 
                    />
                    <div className="ms-3">
                      <SkeletonItem width="120px" height="16px" />
                    </div>
                  </div>
                </td>
              </tr>
              
              {/* Product Items */}
              {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, productIndex) => (
                <tr key={`${index}-${productIndex}`}>
                  <td className="text-center align-middle">
                    <SkeletonItem width="20px" height="20px" />
                  </td>
                  <td className="align-middle">
                    <div className="d-flex align-items-center">
                      <SkeletonItem 
                        width="80px" 
                        height="80px" 
                        borderRadius="8px" 
                      />
                      <div className="ms-3 flex-grow-1">
                        <SkeletonItem width="200px" height="20px" />
                        <div className="mt-2">
                          <SkeletonItem width="100px" height="14px" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <SkeletonItem width="80px" height="16px" />
                  </td>
                  <td className="text-center align-middle">
                    <div className="d-flex align-items-center justify-content-center">
                      <SkeletonItem width="30px" height="30px" borderRadius="4px" />
                      <div className="mx-2">
                        <SkeletonItem width="20px" height="16px" />
                      </div>
                      <SkeletonItem width="30px" height="30px" borderRadius="4px" />
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <SkeletonItem width="100px" height="16px" />
                  </td>
                  <td className="text-center align-middle">
                    <SkeletonItem width="30px" height="30px" borderRadius="4px" />
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* Cart Summary Skeleton */}
      <div className="mt-4 p-3 border rounded">
        <div className="d-flex justify-content-between mb-3">
          <SkeletonItem width="150px" height="16px" />
          <SkeletonItem width="100px" height="16px" />
        </div>
        <div className="d-flex justify-content-between mb-3">
          <SkeletonItem width="120px" height="20px" />
          <SkeletonItem width="120px" height="20px" />
        </div>
        <div className="d-flex gap-2">
          <SkeletonItem width="120px" height="40px" borderRadius="8px" />
          <SkeletonItem width="120px" height="40px" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
};

const CheckoutSkeleton = () => {
  return (
    <div className="checkout-skeleton">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Breadcrumb Skeleton */}
      <div className="mb-4">
        <SkeletonItem width="300px" height="16px" />
      </div>

      {/* Address Section Skeleton */}
      <div className="card mb-4">
        <div className="card-header">
          <SkeletonItem width="150px" height="20px" />
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <SkeletonItem width="50px" height="50px" borderRadius="50%" />
            <div className="ms-3 flex-grow-1">
              <SkeletonItem width="200px" height="16px" />
              <div className="mt-2">
                <SkeletonItem width="300px" height="14px" />
              </div>
            </div>
            <SkeletonItem width="80px" height="32px" borderRadius="6px" />
          </div>
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="card mb-4">
        <div className="card-header">
          <SkeletonItem width="200px" height="20px" />
        </div>
        <div className="card-body">
          <Table borderless>
            <thead>
              <tr>
                <th><SkeletonItem width="100px" height="16px" /></th>
                <th><SkeletonItem width="60px" height="16px" /></th>
                <th><SkeletonItem width="70px" height="16px" /></th>
                <th><SkeletonItem width="80px" height="16px" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 2 }).map((_, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan="4">
                      <div className="d-flex align-items-center mb-2">
                        <SkeletonItem width="50px" height="50px" borderRadius="50%" />
                        <div className="ms-3">
                          <SkeletonItem width="150px" height="16px" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <SkeletonItem width="80px" height="100px" borderRadius="8px" />
                        <div className="ms-3">
                          <SkeletonItem width="180px" height="16px" />
                        </div>
                      </div>
                    </td>
                    <td><SkeletonItem width="80px" height="16px" /></td>
                    <td><SkeletonItem width="30px" height="16px" /></td>
                    <td><SkeletonItem width="100px" height="16px" /></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Payment Summary Skeleton */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <SkeletonItem width="180px" height="20px" />
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <SkeletonItem width="100%" height="120px" borderRadius="8px" />
                </div>
                <div className="col-md-6">
                  <SkeletonItem width="100%" height="120px" borderRadius="8px" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <SkeletonItem width="120px" height="20px" />
            </div>
            <div className="card-body">
              <div className="mb-3">
                <SkeletonItem width="100%" height="16px" />
              </div>
              <div className="mb-3">
                <SkeletonItem width="80%" height="16px" />
              </div>
              <div className="border-top pt-3">
                <SkeletonItem width="100%" height="48px" borderRadius="8px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CartSkeleton, CheckoutSkeleton, SkeletonItem }; 