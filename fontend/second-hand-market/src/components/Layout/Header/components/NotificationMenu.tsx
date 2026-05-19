import React from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import { NotificationMenuProps } from "../types/Header.types";

export const NotificationMenu: React.FC<NotificationMenuProps> = ({
  anchorEl,
  open,
  account,
  notifications,
  onClose,
  onNotificationClick,
  timeAgo,
}) => {
  return (
    <Menu
      disableScrollLock={true}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        list: {
          "aria-labelledby": "basic-button",
          style: { minWidth: 340, padding: 0 },
        },
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        className: "rounded-2xl shadow-[0_8px_32px_rgba(60,72,100,0.18)] mt-2 overflow-hidden",
      }}
    >
      {/* Header */}
      <div className="font-bold text-[17px] text-[#344960] px-6 py-4 pb-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <i className="bi bi-bell-fill text-red-500 text-[20px]"></i>
        Thông báo
      </div>

      {/* Content */}
      {!account || Object.keys(account).length === 0 ? (
        <MenuItem
          className="!justify-center !py-8 !px-5 !flex-col !items-center"
          disabled
        >
          <i className="bi bi-exclamation-triangle-fill text-orange-500 text-[32px] mb-2"></i>
          <div className="text-[#344960] font-medium text-[15px] mb-2 text-center">
            Bạn chưa đăng nhập
            <br />
            Vui lòng đăng nhập để xem thông báo
          </div>
          <Link
            to="/eco-market/login"
            className="px-5 py-2 bg-[#344960] text-white rounded-lg no-underline font-semibold text-[15px] mt-1 hover:bg-[#667eea] transition-all"
            onClick={onClose}
          >
            Đăng nhập
          </Link>
        </MenuItem>
      ) : notifications.length === 0 ? (
        <MenuItem
          disabled
          className="!justify-center !py-8 !px-5 !flex-col !items-center"
        >
          <i className="bi bi-bell-slash text-gray-400 text-[32px] mb-2"></i>
          <div className="text-gray-500 font-medium text-[15px] text-center">
            Không có thông báo mới
          </div>
        </MenuItem>
      ) : (
        notifications.map((noti, idx) => (
          <MenuItem
            key={noti.id}
            onClick={() => onNotificationClick(noti.id)}
            className={`!items-start !gap-3 !px-6 !py-4 !whitespace-normal transition-colors ${
              noti.read ? "!bg-white" : "!bg-blue-50"
            } hover:!bg-gray-50 ${
              idx === notifications.length - 1 ? "" : "border-b border-gray-100"
            }`}
          >
            <span className={`mt-0.5 ${noti.read ? "text-gray-300" : "text-red-500"}`}>
              <i className="bi bi-bell-fill"></i>
            </span>
            <span className="text-[#344960] text-[15px] flex flex-col">
              {noti.message}
              <span className="text-gray-500 text-xs mt-0.5">
                {timeAgo(noti.timestamp)}
              </span>
            </span>
          </MenuItem>
        ))
      )}
    </Menu>
  );
};
