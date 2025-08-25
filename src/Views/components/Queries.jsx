import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Users,
  Package,
  Grid,
  Percent,
  HelpCircle,
} from "lucide-react";
import "./Queries.css";

const Queries = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockTickets = [
      {
        id: "12345",
        customer: "Sophia Clark",
        issue: "Order Inquiry",
        status: "open",
        assignedAgent: "Unassigned",
        lastUpdated: "2 hours ago",
        priority: "high",
        category: "order",
      },
      {
        id: "12346",
        customer: "Ethan Bennett",
        issue: "Product Return",
        status: "pending",
        assignedAgent: "Liam Harper",
        lastUpdated: "1 day ago",
        priority: "medium",
        category: "return",
      },
      {
        id: "12347",
        customer: "Olivia Carter",
        issue: "Payment Issue",
        status: "open",
        assignedAgent: "Unassigned",
        lastUpdated: "3 days ago",
        priority: "high",
        category: "payment",
      },
      {
        id: "12348",
        customer: "Noah Foster",
        issue: "Shipping Delay",
        status: "open",
        assignedAgent: "Unassigned",
        lastUpdated: "5 days ago",
        priority: "medium",
        category: "shipping",
      },
      {
        id: "12349",
        customer: "Ava Mitchell",
        issue: "Damaged Product",
        status: "pending",
        assignedAgent: "Liam Harper",
        lastUpdated: "1 week ago",
        priority: "high",
        category: "damage",
      },
      {
        id: "12350",
        customer: "William Davis",
        issue: "Size Exchange",
        status: "closed",
        assignedAgent: "Emma Wilson",
        lastUpdated: "2 weeks ago",
        priority: "low",
        category: "exchange",
      },
    ];

    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
  }, []);

  useEffect(() => {
    let filtered = tickets;

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === activeTab);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.issue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [activeTab, searchTerm, tickets]);

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#fef3c7";
      case "pending":
        return "#dbeafe";
      case "closed":
        return "#dcfce7";
      default:
        return "#f3f4f6";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "open":
        return "#92400e";
      case "pending":
        return "#1e40af";
      case "closed":
        return "#166534";
      default:
        return "#374151";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return "Open";
      case "pending":
        return "Pending";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeTicketDetails = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="queries">
      <div className="queries-header">
        <div className="header-text">
          <h1>Customer Support Tickets</h1>
          <p>Manage and resolve customer inquiries efficiently</p>
        </div>
      </div>

      <div className="queries-controls">
        <div className="search-section">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search tickets by ID, customer, or issue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="status-tabs">
            <button
              className={`tab-btn ${activeTab === "open" ? "active" : ""}`}
              onClick={() => setActiveTab("open")}
            >
              Open
            </button>
            <button
              className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
            <button
              className={`tab-btn ${activeTab === "closed" ? "active" : ""}`}
              onClick={() => setActiveTab("closed")}
            >
              Closed
            </button>
          </div>

          <div className="filter-dropdowns">
            <div className="filter-dropdown">
              <span>Unassigned</span>
              <ChevronDown size={16} />
            </div>
            <div className="filter-dropdown">
              <span>High Priority</span>
              <ChevronDown size={16} />
            </div>
            <div className="filter-dropdown">
              <span>New</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Assigned Agent</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="ticket-id">#{ticket.id}</td>
                <td className="customer-name">{ticket.customer}</td>
                <td className="issue">{ticket.issue}</td>
                <td>
                  <span className={`status-badge ${ticket.status}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </td>
                <td className="assigned-agent">{ticket.assignedAgent}</td>
                <td className="last-updated">{ticket.lastUpdated}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => openTicketDetails(ticket)}
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTickets.length === 0 && (
        <div className="no-tickets">
          <HelpCircle size={48} className="no-tickets-icon" />
          <h3>No tickets found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={closeTicketDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ticket Details - #{selectedTicket.id}</h2>
              <button className="close-btn" onClick={closeTicketDetails}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Ticket Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Ticket ID:</label>
                    <span>#{selectedTicket.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Customer:</label>
                    <span>{selectedTicket.customer}</span>
                  </div>
                  <div className="detail-item">
                    <label>Issue:</label>
                    <span>{selectedTicket.issue}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedTicket.status}`}>
                      {getStatusLabel(selectedTicket.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Assigned Agent:</label>
                    <span>{selectedTicket.assignedAgent}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated:</label>
                    <span>{selectedTicket.lastUpdated}</span>
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

export default Queries;
