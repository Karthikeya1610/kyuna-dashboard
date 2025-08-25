import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Generate mock sales data for 4 weeks
    const generateSalesData = () => {
      return [
        { week: "Week 1", sales: 2800, income: 1960 },
        { week: "Week 2", sales: 3200, income: 2240 },
        { week: "Week 3", sales: 4100, income: 2870 },
        { week: "Week 4", sales: 2400, income: 1680 },
      ];
    };

    // Generate mock stock data
    const generateStockData = () => {
      return [
        { name: "Gold Rings", stock: 5, total: 100, status: "low" },
        { name: "Diamond Necklaces", stock: 2, total: 50, status: "low" },
        { name: "Silver Bracelets", stock: 0, total: 75, status: "out" },
        { name: "Pearl Earrings", stock: 8, total: 100, status: "low" },
        { name: "Platinum Rings", stock: 3, total: 30, status: "low" },
      ];
    };

    setSalesData(generateSalesData());
    setStockData(generateStockData());
  }, []);

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalIncome = salesData.reduce((sum, item) => sum + item.income, 0);
  const outOfStockCount = stockData.filter(
    (item) => item.status === "out"
  ).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* Key Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value">${totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon income">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Income</h3>
            <p className="stat-value">${totalIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stock">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>Products Out of Stock</h3>
            <p className="stat-value">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Sales Overview Section */}
      <div className="sales-overview-section">
        <div className="section-header">
          <h3>Sales Overview</h3>
          <div className="sales-performance">
            <span className="performance-value">
              ${totalSales.toLocaleString()}
            </span>
            <span className="performance-trend positive">
              Last 30 Days +15%
            </span>
          </div>
        </div>

        <div className="chart-container">
          <h4>Sales Performance</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Products Section */}
      <div className="low-stock-section">
        <h3>Low Stock Products</h3>
        <div className="stock-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stockData
                .filter(
                  (item) => item.status === "low" || item.status === "out"
                )
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <span className={`stock-count ${item.status}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td>
                      <button className="restock-btn">Restock</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
