import { useState, useEffect, useContext } from "react";
import { Search, Plus, Loader2, Pencil, Trash } from "lucide-react";
import { message, Modal, Button, Input, InputNumber } from "antd";
import Context from "../../Context/context";
import "./Price.css";

const Price = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    price: { getPrice, createPrice, updatePrice, deletePrice, prices, loading },
  } = useContext(Context);

  const [filteredPrices, setFilteredPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" or "edit"
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
  });

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [priceToDelete, setPriceToDelete] = useState(null);

  // Fetch prices on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getPrice();
      } catch (error) {
        console.error("Error fetching prices:", error);
        messageApi.error("Failed to fetch prices");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter prices based on search
  useEffect(() => {
    let filtered = prices || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (price) =>
          price.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrices(filtered);
  }, [searchTerm, prices]);

  // Clear form data when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        name: "",
        description: "",
        originalPrice: "",
        discountedPrice: "",
      });
      setModalType("create");
    }
  }, [isModalOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDiscount = (original, discounted) => {
    if (original && discounted) {
      const discount = ((original - discounted) / original) * 100;
      return discount.toFixed(1);
    }
    return 0;
  };

  const openCreateModal = () => {
    setModalType("create");
    setFormData({
      name: "",
      description: "",
      originalPrice: "",
      discountedPrice: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (price) => {
    console.log("Opening edit modal for price:", price);
    setModalType("edit");
    setFormData({
      _id: price._id,
      name: price.name || "",
      description: price.description || "",
      originalPrice: price.originalPrice || "",
      discountedPrice: price.discountedPrice || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      originalPrice: "",
      discountedPrice: "",
    });
    setModalType("create"); // Reset modal type to create
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      messageApi.error("Price name is required");
      return;
    }

    if (!formData.originalPrice || !formData.discountedPrice) {
      messageApi.error("Both original and discounted prices are required");
      return;
    }

    if (
      parseFloat(formData.discountedPrice) >= parseFloat(formData.originalPrice)
    ) {
      messageApi.error("Discounted price must be less than original price");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
      };

      if (modalType === "create") {
        console.log("Creating new price:", payload);
        const result = await createPrice(payload);
        if (result && result.error) {
          throw new Error(result.error);
        }
        messageApi.success("Price created successfully!");
      } else {
        // For edit mode, we need to get the price ID from the current form data
        const priceId = formData._id;
        console.log("Updating price:", priceId, payload);
        const result = await updatePrice(priceId, payload);
        if (result && result.error) {
          throw new Error(result.error);
        }
        messageApi.success("Price updated successfully!");
      }
      // Clear form data after successful submission
      setFormData({
        name: "",
        description: "",
        originalPrice: "",
        discountedPrice: "",
      });
      setModalType("create");
      setIsModalOpen(false);
      // Refresh prices
      await getPrice();
    } catch (error) {
      console.error("Error saving price:", error);
      messageApi.error(
        error.message ||
          (modalType === "create"
            ? "Failed to create price"
            : "Failed to update price")
      );
    }
  };

  const handleDelete = async (priceId) => {
    console.log("Attempting to delete price:", priceId);
    setPriceToDelete(priceId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!priceToDelete) return;

    try {
      console.log("Delete confirmed for price:", priceToDelete);
      const result = await deletePrice(priceToDelete);

      if (result && result.error) {
        throw new Error(result.error);
      }

      messageApi.success("Price deleted successfully!");
      setIsDeleteModalOpen(false);
      setPriceToDelete(null);
      // Refresh prices
      await getPrice();
    } catch (error) {
      console.error("Error deleting price:", error);
      messageApi.error(error.message || "Failed to delete price");
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPriceToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="price-container">
        <div className="price-header">
          <div className="header-text">
            <h1>Price Management</h1>
            <p>Manage your product pricing and discounts</p>
          </div>
        </div>
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={48} />
          <p>Loading prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="price-container">
      {contextHolder}
      <div className="price-header">
        <div className="header-text">
          <h1>Price Management</h1>
          <p>Manage your product pricing and discounts</p>
        </div>
        <button className="add-btn" onClick={openCreateModal}>
          <Plus size={20} />
          Add Price
        </button>
      </div>

      <div className="price-controls">
        <div className="search-section">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search prices by name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="price-table-container">
        <table className="price-table">
          <thead>
            <tr>
              <th>Name</th>
              {/* <th>Description</th> */}
              <th>Original Price</th>
              <th>Discounted Price</th>
              <th>Discount %</th>
              <th>Savings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrices && filteredPrices.length > 0 ? (
              filteredPrices.map((price, index) => (
                <tr key={price._id}>
                  <td className="price-name">{price.name}</td>
                  {/* <td className="price-description">
                    {price.description || "N/A"}
                  </td> */}
                  <td className="original-price">₹{price.originalPrice}</td>
                  <td className="discounted-price">₹{price.discountedPrice}</td>
                  <td className="discount-percentage">
                    {calculateDiscount(
                      price.originalPrice,
                      price.discountedPrice
                    )}
                    %
                  </td>
                  <td className="savings">
                    ₹{(price.originalPrice - price.discountedPrice).toFixed(2)}
                  </td>
                  <td className="status">
                    <span
                      className={`status-badge ${
                        price.isActive ? "active" : "inactive"
                      }`}
                    >
                      {price.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(price)}
                      title="Edit Price"
                    >
                      <Pencil size={16} />
                      <span className="btn-text">Edit</span>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(price._id)}
                      title="Delete Price"
                    >
                      <Trash size={16} />
                      <span className="btn-text">Delete</span>
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
                  <div className="no-prices">
                    <p>No prices found</p>
                    <p>Try adjusting your search or create a new price</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={modalType === "create" ? "Create Price" : "Edit Price"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        okText={modalType === "create" ? "Create" : "Update"}
        cancelText="Cancel"
        width={600}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Price Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter price name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <Input
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Enter price description (optional)"
            />
          </div>
          <div className="form-group">
            <label>Original Price (₹) *</label>
            <InputNumber
              value={formData.originalPrice}
              onChange={(value) => handleFormChange("originalPrice", value)}
              placeholder="Enter original price"
              min={0}
              step={0.01}
              style={{ width: "100%" }}
            />
          </div>
          <div className="form-group">
            <label>Discounted Price (₹) *</label>
            <InputNumber
              value={formData.discountedPrice}
              onChange={(value) => handleFormChange("discountedPrice", value)}
              placeholder="Enter discounted price"
              min={0}
              step={0.01}
              style={{ width: "100%" }}
            />
          </div>
          {formData.originalPrice && formData.discountedPrice && (
            <div className="discount-preview">
              <div className="discount-info">
                <span className="label">Discount:</span>
                <span className="value">
                  {calculateDiscount(
                    formData.originalPrice,
                    formData.discountedPrice
                  )}
                  %
                </span>
              </div>
              <div className="savings-info">
                <span className="label">Savings:</span>
                <span className="value">
                  ₹
                  {(formData.originalPrice - formData.discountedPrice).toFixed(
                    2
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Price"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
        width={400}
      >
        <div style={{ padding: "16px 0" }}>
          <p>Are you sure you want to delete this price?</p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Price;
