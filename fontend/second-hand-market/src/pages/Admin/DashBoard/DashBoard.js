import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [soldProducts, setSoldProducts] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    setLoading(true);
    axios.get(`/admin/dashboard?range=${timeRange}`)
      .then(res => {
        const data = res.data;
        setSalesData(data.salesData || []);
        setCategoryData(data.categoryData || []);
        setUserActivityData(data.userActivityData || []);
        setTotalRevenue(data.totalRevenue || 0);
        setSoldProducts(data.soldProducts || 0);
        setNewUsers(data.newUsers || 0);
        setCompletionRate(data.completionRate || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [timeRange]);

  if (loading) return <div>Đang tải dữ liệu...</div>;

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
          <p className="text-2xl font-bold">{(totalRevenue/1e6).toFixed(1)}M đ</p>
          {/* Có thể thêm % tăng giảm nếu backend trả về */}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Sản phẩm đã bán</h3>
          <p className="text-2xl font-bold">{soldProducts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Người dùng mới</h3>
          <p className="text-2xl font-bold">{newUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Tỷ lệ hoàn thành giao dịch</h3>
          <p className="text-2xl font-bold">{completionRate}%</p>
        </div>
      </div>
    </div>
  );
}
