import { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Items from "./Items";
import Queries from "./Queries";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "items":
        return <Items />;
      case "queries":
        return <Queries />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
