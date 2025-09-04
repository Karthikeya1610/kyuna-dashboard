import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Grid,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/dashboard/orders",
    },
    { id: "items", label: "Items", icon: Package, path: "/dashboard/items" },
    {
      id: "queries",
      label: "User Queries",
      icon: MessageSquare,
      path: "/dashboard/queries",
    },
    {
      id: "categories",
      label: "Categories",
      icon: Grid,
      path: "/dashboard/categories",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          {!isCollapsed && <h2>Store Manager</h2>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              item.id === "dashboard"
                ? location.pathname === "/dashboard" ||
                  location.pathname === "/dashboard/"
                : location.pathname === item.path;
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActive ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <IconComponent size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="admin-info">
            <div className="admin-avatar">
              <span>AD</span>
            </div>
            <div className="admin-details">
              <p className="admin-name">Admin User</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
