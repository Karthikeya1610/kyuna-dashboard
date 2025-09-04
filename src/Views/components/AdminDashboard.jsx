import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Items from "./Items";
import Queries from "./Queries";
import Categories from "./Categories";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  console.log("AdminDashboard rendered");

  return (
    <div className="admin-dashboard">
      <Sidebar onLogout={onLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="items" element={<Items />} />
          <Route path="categories" element={<Categories />} />
          <Route path="queries" element={<Queries />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
