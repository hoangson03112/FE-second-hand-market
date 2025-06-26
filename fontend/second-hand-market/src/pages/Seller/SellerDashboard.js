import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
   RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { useOrder } from '../../contexts/OrderContext';

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const { getMySellerOrders } = useOrder();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state khi fetch lại data
      try {
        const response = await getMySellerOrders();
        console.log('API Response:', response);

        // Xử lý response theo cấu trúc từ server
        if (response?.status === 401) {
          setError('Vui lòng đăng nhập để xem thống kê');
          return;
        }

        if (response?.status && response.status !== 200) {
          setError(response.message || 'Có lỗi xảy ra khi tải dữ liệu');
          return;
        }

        // Xử lý nhiều trường hợp response khác nhau
        let ordersData = [];
        if (Array.isArray(response)) {
          ordersData = response;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (Array.isArray(response.orders)) {
          ordersData = response.orders;
        } else if (Array.isArray(response.data?.orders)) {
          ordersData = response.data.orders;
        }

        if (!ordersData.length) {
          console.log('No orders found');
        }

        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getMySellerOrders]);

  // Process data for charts
  const processOrderData = () => {
    if (!orders || !orders.length) return { 
      dailyStats: [], 
      statusStats: [], 
      monthlyRevenue: [] 
    };

    const dailyMap = new Map();
    const monthlyMap = new Map();
    const statusMap = new Map();

    orders.forEach(order => {
      if (!order?.createdAt) return; // Bỏ qua nếu không có ngày tạo
      
      const date = new Date(order.createdAt).toLocaleDateString('vi-VN');
      const month = new Date(order.createdAt).toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      // Daily stats
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, orders: 0, revenue: 0 });
      }
      const dailyData = dailyMap.get(date);
      dailyData.orders += 1;
      dailyData.revenue += order.totalAmount || 0;

      // Monthly revenue
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, revenue: 0, orders: 0 });
      }
      const monthlyData = monthlyMap.get(month);
      monthlyData.revenue += order.totalAmount || 0;
      monthlyData.orders += 1;

      // Status stats
      const status = order.status || 'pending';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    return {
      dailyStats: Array.from(dailyMap.values()).slice(-7).reverse(), // Hiển thị từ mới nhất
      monthlyRevenue: Array.from(monthlyMap.values()).slice(-6).reverse(),
      statusStats: Array.from(statusMap.entries()).map(([status, count]) => ({
        name: getStatusLabel(status),
        value: count,
        color: getStatusColor(status)
      }))
    };
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#757575';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const { dailyStats, monthlyRevenue, statusStats } = processOrderData();

  // Calculate summary statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const todayOrders = orders.filter(order => {
    if (!order?.createdAt) return false;
    const today = new Date().toDateString();
    return new Date(order.createdAt).toDateString() === today;
  }).length;

  // Styles
  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    margin: '0 4px',
    backgroundColor: isActive ? '#1976d2' : '#f5f5f5',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  });

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
    height: '100%'
  };

  const statCardStyle = (bgColor) => ({
    ...cardStyle,
    background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
    color: 'white',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .hover-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .tab-button:hover {
            transform: translateY(-1px);
          }
        `}
      </style>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1976d2',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center'
        }}>
          📊 Tổng quan gian hàng
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
          Theo dõi hiệu suất kinh doanh và quản lý đơn hàng của bạn
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={statCardStyle('#1976d2')} className="hover-card">
          <div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
              {totalOrders.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Tổng đơn hàng
            </div>
          </div>
          <div style={{ fontSize: '48px', opacity: 0.8 }}>🛒</div>
        </div>

        <div style={statCardStyle('#4caf50')} className="hover-card">
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              {formatCurrency(totalRevenue)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Tổng doanh thu
            </div>
          </div>
          <div style={{ fontSize: '48px', opacity: 0.8 }}>💰</div>
        </div>

        <div style={statCardStyle('#2196f3')} className="hover-card">
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              {formatCurrency(averageOrderValue)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Giá trị TB/đơn
            </div>
          </div>
          <div style={{ fontSize: '48px', opacity: 0.8 }}>📈</div>
        </div>

        <div style={statCardStyle('#ff9800')} className="hover-card">
          <div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
              {todayOrders}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Đơn hàng hôm nay
            </div>
          </div>
          <div style={{ fontSize: '48px', opacity: 0.8 }}>📋</div>
        </div>
      </div>

      {/* Empty state */}
      {!orders.length && (
        <div style={cardStyle}>
          <h3 style={{ textAlign: 'center', color: '#666' }}>
            📭 Chưa có đơn hàng nào
          </h3>
          <p style={{ textAlign: 'center', color: '#999' }}>
            Bạn chưa có đơn hàng nào để hiển thị thống kê
          </p>
        </div>
      )}

      {/* Dashboard content when have orders */}
      {orders.length > 0 && (
        <>
          {/* Tabs */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button 
                style={tabStyle(activeTab === 0)} 
                className="tab-button"
                onClick={() => setActiveTab(0)}
              >
                📊 Biểu đồ doanh thu
              </button>
              <button 
                style={tabStyle(activeTab === 1)} 
                className="tab-button"
                onClick={() => setActiveTab(1)}
              >
                📈 Thống kê đơn hàng
              </button>
              <button 
                style={tabStyle(activeTab === 2)} 
                className="tab-button"
                onClick={() => setActiveTab(2)}
              >
                🔄 Trạng thái đơn hàng
              </button>
            </div>
          </div>

          {/* Chart Content */}
          {activeTab === 0 && (
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#333' }}>
                📈 Doanh thu theo tháng
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1976d2"
                    fill="rgba(25, 118, 210, 0.3)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

            {activeTab === 1 && (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
    gap: '24px' 
  }}>
    {/* Combined Chart - Orders & Revenue */}
    <div style={cardStyle}>
      <h3 style={{ 
        marginTop: 0, 
        marginBottom: '24px', 
        color: '#333',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        📊 Tổng quan đơn hàng & Doanh thu
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={dailyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="orders"
            orientation="left"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="revenue"
            orientation="right"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'orders' ? value : formatCurrency(value),
              name === 'orders' ? 'Đơn hàng' : 'Doanh thu'
            ]}
          />
          <Area 
            yAxisId="orders"
            type="monotone" 
            dataKey="orders" 
            fill="url(#orderGradient)"
            stroke="#1976d2"
            strokeWidth={2}
            dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
          />
          <Line 
            yAxisId="revenue"
            type="monotone" 
            dataKey="revenue" 
            stroke="#4caf50"
            strokeWidth={3}
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#4caf50', strokeWidth: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>

    {/* Revenue Chart with Bar */}
    <div style={cardStyle}>
      <h3 style={{ 
        marginTop: 0, 
        marginBottom: '24px', 
        color: '#333',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        💰 Doanh thu 7 ngày gần đây
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={dailyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu']} />
          <Bar 
            dataKey="revenue" 
            fill="#4caf50" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}

          {activeTab === 2 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '24px' 
            }}>
              <div style={cardStyle}>
                <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#333' }}>
                  🔄 Phân bố trạng thái đơn hàng
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={cardStyle}>
                <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#333' }}>
                  📋 Chi tiết trạng thái
                </h3>
                <div style={{ marginTop: '16px' }}>
                  {statusStats.length > 0 ? (
                    statusStats.map((stat, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: index < statusStats.length - 1 ? '1px solid #e0e0e0' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%', 
                            backgroundColor: stat.color,
                            marginRight: '12px'
                          }} />
                          <span style={{ fontSize: '16px', color: '#333' }}>
                            {stat.name}
                          </span>
                        </div>
                        <span style={{ 
                          fontSize: '20px', 
                          fontWeight: 'bold',
                          color: stat.color
                        }}>
                          {stat.value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '40px 0',
                      color: '#666'
                    }}>
                      Không có dữ liệu trạng thái
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellerDashboard;