import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // Dữ liệu mẫu - thay thế bằng dữ liệu thực tế của bạn
  const salesData = [
    { month: "T1", clothing: 4000, electronics: 2400, furniture: 1800 },
    { month: "T2", clothing: 4200, electronics: 2100, furniture: 2200 },
    { month: "T3", clothing: 3800, electronics: 2800, furniture: 1900 },
    { month: "T4", clothing: 4100, electronics: 2700, furniture: 2100 },
    { month: "T5", clothing: 4600, electronics: 3000, furniture: 2400 },
    { month: "T6", clothing: 5000, electronics: 3200, furniture: 2300 },
  ];

  const categoryData = [
    { name: "Quần áo", value: 35 },
    { name: "Đồ điện tử", value: 25 },
    { name: "Nội thất", value: 20 },
    { name: "Sách", value: 10 },
    { name: "Khác", value: 10 },
  ];

  const userActivityData = [
    { day: "Thứ 2", visits: 120, listings: 15, purchases: 8 },
    { day: "Thứ 3", visits: 140, listings: 12, purchases: 10 },
    { day: "Thứ 4", visits: 150, listings: 18, purchases: 12 },
    { day: "Thứ 5", visits: 180, listings: 20, purchases: 15 },
    { day: "Thứ 6", visits: 220, listings: 25, purchases: 18 },
    { day: "Thứ 7", visits: 240, listings: 30, purchases: 25 },
    { day: "CN", visits: 190, listings: 15, purchases: 12 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Thống kê hệ thống EcoMarket
      </h1>

      <div className="my-4 flex items-center">
        <span className="mr-2 text-gray-700">Xem theo:</span>
        <select
          className="p-2 border rounded"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biểu đồ doanh số theo danh mục */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Doanh số theo danh mục</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clothing"
                name="Quần áo"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="electronics"
                name="Đồ điện tử"
                stroke="#82ca9d"
              />
              <Line
                type="monotone"
                dataKey="furniture"
                name="Nội thất"
                stroke="#ffc658"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tỷ lệ sản phẩm theo danh mục */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Tỷ lệ sản phẩm theo danh mục
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hoạt động người dùng */}
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Hoạt động người dùng (7 ngày qua)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={userActivityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" name="Lượt truy cập" fill="#8884d8" />
              <Bar dataKey="listings" name="Đăng bán mới" fill="#82ca9d" />
              <Bar
                dataKey="purchases"
                name="Giao dịch thành công"
                fill="#ffc658"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Tổng doanh thu</h3>
          <p className="text-2xl font-bold">120.5M đ</p>
          <p className="text-green-500 text-sm">+12.5% so với tháng trước</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Sản phẩm đã bán</h3>
          <p className="text-2xl font-bold">305</p>
          <p className="text-green-500 text-sm">+8.3% so với tháng trước</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Người dùng mới</h3>
          <p className="text-2xl font-bold">87</p>
          <p className="text-green-500 text-sm">+15.2% so với tháng trước</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Tỷ lệ hoàn thành giao dịch</h3>
          <p className="text-2xl font-bold">68%</p>
          <p className="text-red-500 text-sm">-3.1% so với tháng trước</p>
        </div>
      </div>
    </div>
  );
}
