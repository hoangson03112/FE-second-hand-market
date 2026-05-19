import React from "react";
import { Link } from "react-router-dom";
import { UserDropdownProps } from "../types/Header.types";

export const UserDropdown: React.FC<UserDropdownProps> = ({
  account,
  showDropdown,
  dropdownRef,
  onToggle,
  onLogout,
}) => {
  return (
    <div className="flex items-center">
      <div className="inline-block relative ml-4 min-w-[200px]" ref={dropdownRef}>
        {/* Profile Toggle */}
        <div
          className="flex items-center cursor-pointer px-3 py-2 rounded-[25px] transition-all duration-300 bg-white/90 backdrop-blur-[10px] border border-white/20 shadow-sm hover:bg-[#f0f4f8] hover:-translate-y-0.5 hover:shadow-md"
          onClick={onToggle}
        >
          <img
            src={
              account?.avatar?.url ||
              "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
            }
            alt="User"
            className="w-10 h-10 rounded-full mr-2.5 border-2 border-white/80 shadow-sm"
          />
          <span className="font-semibold text-[#344960] mr-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
            {account?.fullName}
          </span>
          <i className={`bi bi-chevron-down text-xs text-[#344960] transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}></i>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-white border-0 rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden backdrop-blur-[20px] border border-white/20 min-w-[200px] animate-[fadeInUp_0.3s_ease-out]">
            <Link
              className="block px-5 py-3 font-medium transition-all duration-200 flex items-center no-underline text-gray-700 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
              to="/eco-market/user/profile"
            >
              <i className="bi bi-person me-2"></i>Hồ sơ
            </Link>
            <Link
              className="block px-5 py-3 font-medium transition-all duration-200 flex items-center no-underline text-gray-700 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
              to="/eco-market/customer/orders"
            >
              <i className="bi bi-box-seam me-2"></i>Đơn Hàng
            </Link>
            {account?.role === "seller" && (
              <Link
                className="block px-5 py-3 font-medium transition-all duration-200 flex items-center no-underline text-gray-700 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
                to="/eco-market/seller"
              >
                <i className="bi bi-shop me-2"></i>Gian Hàng
              </Link>
            )}
            {account?.role === "admin" && (
              <Link
                className="block px-5 py-3 font-medium transition-all duration-200 flex items-center no-underline text-gray-700 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
                to="/eco-market/admin"
              >
                <i className="bi bi-gear me-2"></i>Admin
              </Link>
            )}
            <Link
              className="block px-5 py-3 font-medium transition-all duration-200 flex items-center no-underline text-gray-700 hover:bg-[#f0f4f8] hover:text-[#344960] hover:translate-x-1"
              to="#"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
