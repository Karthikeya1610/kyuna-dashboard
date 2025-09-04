import { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Pencil,
  Trash,
} from "lucide-react";
import { message, Modal, Button, Input, Select } from "antd";
import context from "../../Context/context";
import "./Categories.css";

const { Option } = Select;

// Debug: Check if icons are imported correctly
console.log("Icons imported:", { Pencil, Trash, Edit, Trash2 });

const Categories = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    categories: {
      getAllCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      categories,
      loading,
      hasMore,
      currentPage,
    },
  } = useContext(context);

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" or "edit"
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Infinite scroll observer
  const observer = useRef();
  const lastCategoryRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreCategories();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreCategories = async () => {
    if (!loading && hasMore) {
      await getAllCategories(currentPage + 1, true);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getAllCategories(1, false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        messageApi.error("Failed to fetch categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter categories based on search and tab
  useEffect(() => {
    let filtered = categories || [];

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (category) => category.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((category) =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [activeTab, searchTerm, categories]);

  // Clear form data when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        name: "",
        image: "",
      });
      setModalType("create");
    }
  }, [isModalOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const openCreateModal = () => {
    setModalType("create");
    setFormData({
      name: "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    console.log("Opening edit modal for category:", category);
    setModalType("edit");
    setFormData({
      _id: category._id,
      name: category.name || "",
      image: category.image || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      image: "",
    });
    setModalType("create"); // Reset modal type to create
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      messageApi.error("Category name is required");
      return;
    }

    try {
      if (modalType === "create") {
        console.log("Creating new category:", formData);
        const result = await createCategory(formData);
        if (result && result.error) {
          throw new Error(result.error);
        }
        messageApi.success("Category created successfully!");
      } else {
        // For edit mode, we need to get the category ID from the current form data
        const categoryId = formData._id;
        console.log("Updating category:", categoryId, formData);
        const result = await updateCategory(categoryId, formData);
        if (result && result.error) {
          throw new Error(result.error);
        }
        messageApi.success("Category updated successfully!");
      }
      // Clear form data after successful submission
      setFormData({
        name: "",
        image: "",
      });
      setModalType("create");
      setIsModalOpen(false);
      // Refresh categories
      await getAllCategories(1, false);
    } catch (error) {
      console.error("Error saving category:", error);
      messageApi.error(
        error.message ||
          (modalType === "create"
            ? "Failed to create category"
            : "Failed to update category")
      );
    }
  };

  const handleDelete = async (categoryId) => {
    console.log("Attempting to delete category:", categoryId);
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      console.log("Delete confirmed for category:", categoryToDelete);
      const result = await deleteCategory(categoryToDelete);

      if (result && result.error) {
        throw new Error(result.error);
      }

      messageApi.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      // Refresh categories
      await getAllCategories(1, false);
    } catch (error) {
      console.error("Error deleting category:", error);
      messageApi.error(error.message || "Failed to delete category");
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="categories">
        <div className="categories-header">
          <div className="header-text">
            <h1>Categories</h1>
            <p>Manage product categories and classifications</p>
          </div>
        </div>
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={48} />
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories">
      {contextHolder}
      <div className="categories-header">
        <div className="header-text">
          <h1>Categories</h1>
          <p>Manage product categories and classifications</p>
        </div>
        <button className="add-btn" onClick={openCreateModal}>
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="categories-controls">
        <div className="search-section">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search categories by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="categories-table-container">
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Image</th>
              <th>Products Count</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories && filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <tr
                  key={category._id}
                  ref={
                    index === filteredCategories.length - 1
                      ? lastCategoryRef
                      : null
                  }
                >
                  <td className="category-name">{category.name}</td>
                  <td className="category-image">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#9ca3af" }}>No image</span>
                    )}
                  </td>
                  <td className="products-count">
                    {category.productsCount || 0}
                  </td>
                  <td className="created-at">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(category)}
                      title="Edit Category"
                    >
                      <Pencil size={16} />
                      <span className="btn-text">Edit</span>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(category._id)}
                      title="Delete Category"
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
                  colSpan="5"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  <div className="no-categories">
                    <p>No categories found</p>
                    <p>Try adjusting your search or create a new category</p>
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
          <p>Loading more categories...</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={modalType === "create" ? "Create Category" : "Edit Category"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        okText={modalType === "create" ? "Create" : "Update"}
        cancelText="Cancel"
        width={600}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Category Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) => handleFormChange("image", e.target.value)}
              placeholder="Enter image URL (optional)"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Category"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
        width={400}
      >
        <div style={{ padding: "16px 0" }}>
          <p>Are you sure you want to delete this category?</p>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
