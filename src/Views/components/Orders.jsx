import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
  AlertCircle,
  Bell,
  User,
} from "lucide-react";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders = [
      {
        id: "12345",
        customerName: "Sophia Clark",
        date: "2023-08-15",
        status: "delivered",
        total: 50.0,
      },
      {
        id: "12346",
        customerName: "Liam Carter",
        date: "2023-08-16",
        status: "pending",
        total: 75.0,
      },
      {
        id: "12347",
        customerName: "Emma Wilson",
        date: "2023-08-17",
        status: "ready",
        total: 120.0,
      },
      {
        id: "12348",
        customerName: "Noah Johnson",
        date: "2023-08-18",
        status: "delivered",
        total: 95.0,
      },
      {
        id: "12349",
        customerName: "Olivia Davis",
        date: "2023-08-19",
        status: "pending",
        total: 180.0,
      },
      {
        id: "12350",
        customerName: "William Brown",
        date: "2023-08-20",
        status: "ready",
        total: 65.0,
      },
      {
        id: "12351",
        customerName: "Ava Miller",
        date: "2023-08-21",
        status: "delivered",
        total: 210.0,
      },
      {
        id: "12352",
        customerName: "James Taylor",
        date: "2023-08-22",
        status: "pending",
        total: 45.0,
      },
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [activeTab, searchTerm, orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "#10b981";
      case "ready":
        return "#3b82f6";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "ready":
        return "Ready";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <div className="logo-icon"></div>
            <span className="logo-text">Local Store</span>
          </div>
          <nav className="nav-links">
            <a href="#" className="nav-link">
              Home
            </a>
            <a href="#" className="nav-link">
              Products
            </a>
            <a href="#" className="nav-link active">
              Orders
            </a>
            <a href="#" className="nav-link">
              Customers
            </a>
          </nav>
        </div>
        <div className="nav-right">
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Search" />
          </div>
          <button className="notification-btn">
            <Bell size={20} />
          </button>
          <div className="user-profile">
            <User size={20} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="orders-content">
        <div className="orders-header">
          <div className="header-text">
            <h1>Orders</h1>
            <p>Manage your orders</p>
          </div>
        </div>

        {/* Order Status Tabs */}
        <div className="order-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Orders
          </button>
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`tab-btn ${activeTab === "ready" ? "active" : ""}`}
            onClick={() => setActiveTab("ready")}
          >
            Ready
          </button>
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} onClick={() => openOrderDetails(order)}>
                  <td className="order-id">#{order.id}</td>
                  <td className="customer-name">{order.customerName}</td>
                  <td className="order-date">{order.date}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="order-total">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <Package size={48} className="no-orders-icon" />
            <h3>No orders found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - #{selectedOrder.id}</h2>
              <button className="close-btn" onClick={closeOrderDetails}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Order ID:</label>
                    <span>#{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Customer:</label>
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{selectedOrder.date}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedOrder.status}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Total:</label>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
