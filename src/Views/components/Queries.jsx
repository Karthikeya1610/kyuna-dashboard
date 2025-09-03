import { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Users,
  Package,
  Grid,
  Percent,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { message } from "antd";
import context from "../../Context/context";
import "./Queries.css";

const Queries = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    queries: {
      getAllQueries,
      updateQuery,
      bulkUpdateQueries,
      getQueryStats,
      queries,
      queryStats,
      loading,
      hasMore,
      currentPage,
    },
  } = useContext(context);

  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Infinite scroll observer
  const observer = useRef();
  const lastQueryRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreQueries();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreQueries = async () => {
    if (!loading && hasMore) {
      await getAllQueries(currentPage + 1, true);
    }
  };

  // Fetch queries and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching queries data...");
        const [queriesResponse, statsResponse] = await Promise.all([
          getAllQueries(1, false),
          getQueryStats(),
        ]);
        console.log("Queries response:", queriesResponse);
        console.log("Stats response:", statsResponse);
      } catch (error) {
        console.error("Error fetching queries data:", error);
        messageApi.error("Failed to fetch queries data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array since functions are stable

  // Filter queries based on search and tab
  useEffect(() => {
    console.log("Current queries state:", queries);
    let filtered = queries || [];

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (query) => query.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (query) =>
          query._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log("Filtered queries:", filtered);
    setFilteredQueries(filtered);
  }, [activeTab, searchTerm, queries]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "#fef3c7";
      case "in_progress":
        return "#dbeafe";
      case "resolved":
        return "#dcfce7";
      case "closed":
        return "#f3f4f6";
      default:
        return "#f3f4f6";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "#92400e";
      case "in_progress":
        return "#1e40af";
      case "resolved":
        return "#166534";
      case "closed":
        return "#6b7280";
      default:
        return "#374151";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    switch (status.toLowerCase()) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getPriorityLabel = (priority) => {
    if (!priority) return "Unknown";
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown";

    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  const openQueryDetails = (query) => {
    setSelectedQuery(query);
  };

  const closeQueryDetails = () => {
    setSelectedQuery(null);
  };

  const handleStatusUpdate = async (queryId, newStatus) => {
    try {
      const response = await updateQuery(queryId, { status: newStatus });
      if (response) {
        messageApi.success("Query status updated successfully!");
        // Refresh queries
        await getAllQueries(1, false);
      }
    } catch (error) {
      console.error("Error updating query status:", error);
      messageApi.error("Failed to update query status");
    }
  };

  if (isLoading) {
    return (
      <div className="queries">
        <div className="queries-header">
          <div className="header-text">
            <h1>Customer Support Queries</h1>
            <p>Manage and resolve customer inquiries efficiently</p>
          </div>
        </div>
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={48} />
          <p>Loading queries...</p>
        </div>
      </div>
    );
  }

  // Debug info
  console.log("Render state:", {
    queries,
    filteredQueries,
    loading,
    hasMore,
    currentPage,
  });

  return (
    <div className="queries">
      {contextHolder}
      <div className="queries-header">
        <div className="header-text">
          <h1>Customer Support Queries</h1>
          <p>Manage and resolve customer inquiries efficiently</p>
        </div>
      </div>

      <div className="queries-controls">
        <div className="search-section">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search queries by ID, customer, or subject"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="status-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`tab-btn ${activeTab === "open" ? "active" : ""}`}
              onClick={() => setActiveTab("open")}
            >
              Open
            </button>
            <button
              className={`tab-btn ${
                activeTab === "in_progress" ? "active" : ""
              }`}
              onClick={() => setActiveTab("in_progress")}
            >
              In Progress
            </button>
            <button
              className={`tab-btn ${activeTab === "resolved" ? "active" : ""}`}
              onClick={() => setActiveTab("resolved")}
            >
              Resolved
            </button>
            <button
              className={`tab-btn ${activeTab === "closed" ? "active" : ""}`}
              onClick={() => setActiveTab("closed")}
            >
              Closed
            </button>
          </div>
        </div>
      </div>

      <div className="queries-table-container">
        <table className="queries-table">
          <thead>
            <tr>
              <th>Query ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries && filteredQueries.length > 0 ? (
              filteredQueries.map((query, index) => (
                <tr
                  key={query._id}
                  ref={
                    index === filteredQueries.length - 1 ? lastQueryRef : null
                  }
                >
                  <td className="query-id">#{query._id.slice(-6)}</td>
                  <td className="customer-name">
                    <div className="customer-info">
                      <span className="name">
                        {query.user?.name || "Unknown"}
                      </span>
                      <span className="email">{query.user?.email}</span>
                    </div>
                  </td>
                  <td className="subject">{query.subject}</td>
                  <td className="category">
                    <span className="category-badge">{query.category}</span>
                  </td>
                  <td className="priority">
                    <span
                      className="priority-badge"
                      style={{ color: getPriorityColor(query.priority) }}
                    >
                      {getPriorityLabel(query.priority)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${query.status}`}>
                      {getStatusLabel(query.status)}
                    </span>
                  </td>
                  <td className="created-at">
                    {formatTimeAgo(query.createdAt)}
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openQueryDetails(query)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <div className="no-queries">
                    <HelpCircle size={48} className="no-queries-icon" />
                    <h3>No queries found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="loading-more">
          <Loader2 className="loading-spinner" size={24} />
          <p>Loading more queries...</p>
        </div>
      )}

      {/* Query Details Modal */}
      {selectedQuery && (
        <div className="modal-overlay" onClick={closeQueryDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Query Details - #{selectedQuery._id.slice(-6)}</h2>
              <button className="close-btn" onClick={closeQueryDetails}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Query Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Query ID:</label>
                    <span>#{selectedQuery._id.slice(-6)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Customer:</label>
                    <span>{selectedQuery.user?.name || "Unknown"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedQuery.user?.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Subject:</label>
                    <span>{selectedQuery.subject}</span>
                  </div>
                  <div className="detail-item">
                    <label>Message:</label>
                    <span className="message-content">
                      {selectedQuery.message}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Category:</label>
                    <span className="category-badge">
                      {selectedQuery.category}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Priority:</label>
                    <span
                      className="priority-badge"
                      style={{
                        color: getPriorityColor(selectedQuery.priority),
                      }}
                    >
                      {getPriorityLabel(selectedQuery.priority)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedQuery.status}`}>
                      {getStatusLabel(selectedQuery.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>
                      {new Date(selectedQuery.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated:</label>
                    <span>
                      {new Date(selectedQuery.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedQuery.tags && selectedQuery.tags.length > 0 && (
                <div className="detail-section">
                  <h3>Tags</h3>
                  <div className="tags-container">
                    {selectedQuery.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Actions</h3>
                <div className="action-buttons">
                  {selectedQuery.status !== "closed" && (
                    <button
                      className="action-btn close-btn"
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "closed")
                      }
                    >
                      Close Query
                    </button>
                  )}
                  {selectedQuery.status === "open" && (
                    <button
                      className="action-btn in-progress-btn"
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "in_progress")
                      }
                    >
                      Mark as In Progress
                    </button>
                  )}
                  {selectedQuery.status === "in_progress" && (
                    <button
                      className="action-btn resolve-btn"
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "resolved")
                      }
                    >
                      Mark as Resolved
                    </button>
                  )}
                  {selectedQuery.status === "resolved" && (
                    <button
                      className="action-btn close-btn"
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, "closed")
                      }
                    >
                      Close Query
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;
