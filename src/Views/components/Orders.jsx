import { useState, useEffect, useContext, useCallback, useRef } from "react";
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
  X,
} from "lucide-react";
import { message, Modal, Select, Input, Button } from "antd";
import context from "../../Context/context";
import "./Orders.css";

const { TextArea } = Input;
const { Option } = Select;

const Orders = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    orders: {
      getOrders,
      updateOrderStatus,
      cancelOrder,
      getOrdersOverview,
      orders,
      ordersOverview,
      loading,
      hasMore,
      currentPage,
    },
  } = useContext(context);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Status update modal state
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: "",
    notes: "",
  });

  // Cancel order modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  // Infinite scroll observer
  const observer = useRef();
  const lastOrderRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreOrders();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreOrders = async () => {
    if (!loading && hasMore) {
      await getOrders(currentPage + 1, true);
    }
  };

  // Fetch orders and overview on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getOrders(1, false), getOrdersOverview()]);
      } catch (error) {
        console.error("Error fetching orders data:", error);
        messageApi.error("Failed to fetch orders data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter orders based on search and tab
  useEffect(() => {
    let filtered = orders || [];

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (order) => order.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [activeTab, searchTerm, orders]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "#10b981";
      case "shipped":
      case "ready":
        return "#3b82f6";
      case "pending":
      case "processing":
        return "#f59e0b";
      case "cancelled":
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async () => {
    if (!statusForm.status || !selectedOrder) return;

    setIsUpdatingStatus(true);
    try {
      const response = await updateOrderStatus(selectedOrder._id, statusForm);
      if (response) {
        messageApi.success("Order status updated successfully!");
        setStatusModalVisible(false);
        setStatusForm({ status: "", notes: "" });
        closeOrderDetails();
        // Refresh orders
        await getOrders(1, false);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      messageApi.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellationReason || !selectedOrder) return;

    setIsCancelling(true);
    try {
      const response = await cancelOrder(selectedOrder._id, {
        cancellationReason,
      });
      if (response) {
        messageApi.success("Order cancelled successfully!");
        setCancelModalVisible(false);
        setCancellationReason("");
        closeOrderDetails();
        // Refresh orders
        await getOrders(1, false);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      messageApi.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const openStatusModal = () => {
    setStatusForm({
      status: selectedOrder?.status || "",
      notes: "",
    });
    setStatusModalVisible(true);
  };

  const openCancelModal = () => {
    setCancellationReason("");
    setCancelModalVisible(true);
  };

  return (
    <>
      {contextHolder}
      <div className="orders">
        {/* Main Content */}
        <div className="orders-content">
          <div className="orders-header">
            <div className="header-text">
              <h1>Orders</h1>
              <p>Manage your orders</p>
            </div>
            {ordersOverview && (
              <div className="orders-overview">
                <div className="orders-stats">
                  <div className="stat-item">
                    <span className="stat-number">
                      {ordersOverview.stats?.totalOrders || 0}
                    </span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      $
                      {ordersOverview.stats?.totalRevenue?.toLocaleString() ||
                        0}
                    </span>
                    <span className="stat-label">Total Revenue</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      $
                      {ordersOverview.stats?.averageOrderValue?.toLocaleString() ||
                        0}
                    </span>
                    <span className="stat-label">Avg Order Value</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {ordersOverview.stats?.statusBreakdown?.Pending || 0}
                    </span>
                    <span className="stat-label">Pending Orders</span>
                  </div>
                </div>
              </div>
            )}
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
              className={`tab-btn ${
                activeTab === "processing" ? "active" : ""
              }`}
              onClick={() => setActiveTab("processing")}
            >
              Processing
            </button>
            <button
              className={`tab-btn ${activeTab === "shipped" ? "active" : ""}`}
              onClick={() => setActiveTab("shipped")}
            >
              Shipped
            </button>
            <button
              className={`tab-btn ${activeTab === "delivered" ? "active" : ""}`}
              onClick={() => setActiveTab("delivered")}
            >
              Delivered
            </button>
          </div>

          {/* Orders Table */}
          <div className="orders-table-container">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    if (filteredOrders.length === index + 1) {
                      return (
                        <tr key={order._id} ref={lastOrderRef}>
                          <td className="order-id">#{order._id?.slice(-8)}</td>
                          <td className="customer-name">
                            <div>
                              <div>{order.user?.name}</div>
                              <small>{order.user?.email}</small>
                            </div>
                          </td>
                          <td className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: getStatusColor(order.status),
                              }}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="order-total">
                            ${order.totalPrice?.toFixed(2)}
                          </td>
                          <td>
                            <button
                              className="view-btn"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={order._id}>
                          <td className="order-id">#{order._id?.slice(-8)}</td>
                          <td className="customer-name">
                            <div>
                              <div>{order.user?.name}</div>
                              <small>{order.user?.email}</small>
                            </div>
                          </td>
                          <td className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: getStatusColor(order.status),
                              }}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="order-total">
                            ${order.totalPrice?.toFixed(2)}
                          </td>
                          <td>
                            <button
                              className="view-btn"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            )}
          </div>

          {loading && (
            <div className="loading-more">
              <div className="spinner"></div>
              <p>Loading more orders...</p>
            </div>
          )}

          {!isLoading && filteredOrders.length === 0 && (
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
                <h2>Order Details - #{selectedOrder._id?.slice(-8)}</h2>
                <button className="close-btn" onClick={closeOrderDetails}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Order Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Order ID:</label>
                      <span>#{selectedOrder._id?.slice(-8)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Customer:</label>
                      <span>{selectedOrder.user?.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedOrder.user?.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date:</label>
                      <span>
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusColor(selectedOrder.status),
                        }}
                      >
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Total:</label>
                      <span>${selectedOrder.totalPrice?.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Method:</label>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="detail-item">
                      <label>Payment Status:</label>
                      <span>{selectedOrder.isPaid ? "Paid" : "Unpaid"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Delivery Status:</label>
                      <span>
                        {selectedOrder.isDelivered
                          ? "Delivered"
                          : "Not Delivered"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrder.shippingAddress && (
                  <div className="detail-section">
                    <h3>Shipping Address</h3>
                    <div className="shipping-address">
                      <div className="address-item">
                        <label>Address:</label>
                        <span>{selectedOrder.shippingAddress.address}</span>
                      </div>
                      <div className="address-item">
                        <label>City:</label>
                        <span>{selectedOrder.shippingAddress.city}</span>
                      </div>
                      <div className="address-item">
                        <label>Postal Code:</label>
                        <span>{selectedOrder.shippingAddress.postalCode}</span>
                      </div>
                      <div className="address-item">
                        <label>Country:</label>
                        <span>{selectedOrder.shippingAddress.country}</span>
                      </div>
                      <div className="address-item">
                        <label>Phone:</label>
                        <span>{selectedOrder.shippingAddress.phone}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOrder.orderItems &&
                  selectedOrder.orderItems.length > 0 && (
                    <div className="detail-section">
                      <h3>Order Items</h3>
                      <div className="order-items">
                        {selectedOrder.orderItems.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-info">
                              <div className="item-name">{item.name}</div>
                              <div className="item-price">${item.price}</div>
                            </div>
                            <div className="item-quantity">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="detail-section">
                  <h3>Pricing Breakdown</h3>
                  <div className="pricing-breakdown">
                    <div className="price-item">
                      <label>Items Price:</label>
                      <span>${selectedOrder.itemsPrice?.toFixed(2)}</span>
                    </div>
                    <div className="price-item">
                      <label>Tax:</label>
                      <span>${selectedOrder.taxPrice?.toFixed(2)}</span>
                    </div>
                    <div className="price-item">
                      <label>Shipping:</label>
                      <span>${selectedOrder.shippingPrice?.toFixed(2)}</span>
                    </div>
                    <div className="price-item total">
                      <label>Total:</label>
                      <span>${selectedOrder.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.status === "Cancelled" && (
                  <div className="detail-section">
                    <h3>Cancellation Details</h3>
                    <div className="cancellation-details">
                      <div className="cancel-item">
                        <label>Reason:</label>
                        <span>{selectedOrder.cancellationReason}</span>
                      </div>
                      <div className="cancel-item">
                        <label>Cancelled By:</label>
                        <span>{selectedOrder.cancelledBy}</span>
                      </div>
                      <div className="cancel-item">
                        <label>Cancelled At:</label>
                        <span>
                          {new Date(selectedOrder.cancelledAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <Button
                    type="primary"
                    onClick={openStatusModal}
                    disabled={selectedOrder.status === "cancelled"}
                  >
                    Update Status
                  </Button>
                  <Button
                    danger
                    onClick={openCancelModal}
                    disabled={selectedOrder.status === "cancelled"}
                  >
                    Cancel Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        <Modal
          title="Update Order Status"
          open={statusModalVisible}
          onCancel={() => setStatusModalVisible(false)}
          footer={null}
        >
          <div style={{ marginBottom: 16 }}>
            <label>Status:</label>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              value={statusForm.status}
              onChange={(value) =>
                setStatusForm((prev) => ({ ...prev, status: value }))
              }
              placeholder="Select status"
            >
              <Option value="Pending">Pending</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Shipped">Shipped</Option>
              <Option value="Delivered">Delivered</Option>
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Notes (optional):</label>
            <TextArea
              rows={3}
              value={statusForm.notes}
              onChange={(e) =>
                setStatusForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add any notes about this status update..."
              style={{ marginTop: 8 }}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setStatusModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleStatusUpdate}
              loading={isUpdatingStatus}
            >
              Update Status
            </Button>
          </div>
        </Modal>

        {/* Cancel Order Modal */}
        <Modal
          title="Cancel Order"
          open={cancelModalVisible}
          onCancel={() => setCancelModalVisible(false)}
          footer={null}
        >
          <div style={{ marginBottom: 16 }}>
            <label>Cancellation Reason:</label>
            <TextArea
              rows={3}
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this order..."
              style={{ marginTop: 8 }}
            />
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setCancelModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button danger onClick={handleCancelOrder} loading={isCancelling}>
              Cancel Order
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Orders;
