import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../../common/Input";
import { MobileMenuProps } from "../types/Header.types";

export const MobileMenu: React.FC<MobileMenuProps> = ({
  show,
  account,
  categories,
  onSearch,
  onClose,
  onLogout,
}) => {
  return (
    <div
      className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1000] transition-all duration-300 ease-in-out ${
        show
          ? "translate-y-0 opacity-100 visible max-h-[500px]"
          : "-translate-y-full opacity-0 invisible max-h-0 overflow-hidden"
      }`}
    >
      {/* Mobile Search */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <SearchBar onSearch={onSearch} />
      </div>

      <nav className="nav flex-col">
        {/* Categories Section */}
        <div className="border-b border-gray-200 mb-2">
          <div className="py-3 px-5 pb-2 font-semibold text-sm text-[#344960] uppercase tracking-wider bg-gray-50 border-b border-[#f0f4f8]">
            <i className="bi bi-grid-3x3-gap-fill me-2"></i>
            Danh mục
          </div>
          {categories?.slice(0, 4).map((category) => (
            <Link
              key={category._id}
              className="flex items-center py-3 px-5 pl-10 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 border-b border-gray-100 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
              to={`/eco-market?categoryID=${category._id}`}
              onClick={onClose}
            >
              <i className="bi bi-tag me-2 text-sm w-5"></i>
              {category.name}
            </Link>
          ))}
          <Link
            className="flex items-center py-3 px-5 text-[#344960] no-underline font-medium border-0 bg-gray-50 w-full text-left transition-all duration-300 border-t border-[#f0f4f8] hover:bg-[#f0f4f8]"
            to="/eco-market"
            onClick={onClose}
          >
            <i className="bi bi-grid me-2 text-sm w-5"></i>
            Xem tất cả danh mục
          </Link>
        </div>

        {/* Sell Button */}
        <Link
          className="flex items-center py-4 px-5 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 border-b border-gray-100 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
          to={
            !account || Object.keys(account).length === 0
              ? "/eco-market/login"
              : account?.role === "buyer"
              ? "/eco-market/seller/register"
              : "/eco-market/seller/products/create"
          }
          onClick={onClose}
        >
          <i className="bi bi-plus-circle-fill me-2 text-sm w-5"></i>
          Đăng Bán
        </Link>

        {/* Cart (for logged in users) */}
        {account && Object.keys(account).length > 0 && (
          <Link
            to="/eco-market/my-cart"
            className="flex items-center py-4 px-5 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 border-b border-gray-100 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
            onClick={onClose}
          >
            <i className="bi bi-bag-heart-fill me-2 text-sm w-5"></i>
            Giỏ hàng ({account.cart?.length || 0})
          </Link>
        )}

        {/* User Menu */}
        {account && Object.keys(account).length > 0 ? (
          <>
            <Link
              className="flex items-center py-4 px-5 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 border-b border-gray-100 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
              to="/eco-market/user/profile"
              onClick={onClose}
            >
              <i className="bi bi-person me-2 text-sm w-5"></i>Hồ sơ
            </Link>
            <Link
              className="flex items-center py-4 px-5 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 border-b border-gray-100 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
              to="/eco-market/customer/orders"
              onClick={onClose}
            >
              <i className="bi bi-box-seam me-2 text-sm w-5"></i>Đơn Hàng
            </Link>
            {account?.role === "admin" && (
              <Link
                className="flex items-center py-4 px-5 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 border-b border-gray-100 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
                to="/eco-market/admin"
                onClick={onClose}
              >
                <i className="bi bi-gear me-2 text-sm w-5"></i>Admin
              </Link>
            )}
            <button
              className="flex items-center py-4 px-5 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <i className="bi bi-box-arrow-right me-2 text-sm w-5"></i>Đăng xuất
            </button>
          </>
        ) : (
          <Link
            className="flex items-center py-4 px-5 text-[#344960] no-underline font-medium border-0 bg-transparent w-full text-left transition-all duration-300 border-b border-gray-100 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
            to="/eco-market/login"
            onClick={onClose}
          >
            <i className="bi bi-person-circle me-2 text-sm w-5"></i>
            Đăng nhập / Đăng ký
          </Link>
        )}
      </nav>
    </div>
  );
};
