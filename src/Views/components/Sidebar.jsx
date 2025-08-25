import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "items", label: "Items", icon: Package },
    { id: "queries", label: "User Queries", icon: MessageSquare },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
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
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === item.id ? "active" : ""
                  }`}
                  onClick={() => onTabChange(item.id)}
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
