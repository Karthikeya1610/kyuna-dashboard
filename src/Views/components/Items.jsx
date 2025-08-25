import { useState, useEffect, useContext } from "react";
import context from "../../Context/context";
import { Search, Plus, Edit, Package, Trash2 } from "lucide-react";
import "./Items.css";
import ItemsModal from "./Modal/ItemsModal";

const initialData = {
  name: "",
  category: "",
  price: "",
  discountPrice: "",
  rating: "",
  availability: "",
  images: [],
  description: "",
  specifications: [],
  ratingBreajdown: {},
};

const Items = () => {
  const {
    items: { getItems, items, getItemsId, itemsId, getItemsDelete },
  } = useContext(context);

  const [searchTerm, setSearchTerm] = useState("");
  const [info, setInfo] = useState({
    ...initialData,
    showAddItemModel: false,
    itemData: initialData,
    actionType: "",
    activeButton: "add",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getItems();
  }, []);

  let Data = items?.items || [];

  const handleAddItem = () => {
    setInfo({
      ...info,
      showAddItemModel: true,
      actionType: "add",
    });
  };

  const handleEditItem = async (itemId) => {
    setIsLoading(true);
    setInfo((prev) => ({
      ...prev,
      showAddItemModel: true,
      actionType: "edit",
    }));
    await getItemsId(itemId);
    setIsLoading(false);
  };

  const handleCloseModel = () => {
    setInfo((prev) => ({
      ...prev,
      showAddItemModel: false,
    }));
  };

  const handleDeleteItem = async (itemId, itemName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    );

    if (isConfirmed) {
      try {
        setIsLoading(true);
        const response = await getItemsDelete(itemId);
        if (response) {
          // Refresh the items list after successful deletion
          await getItems();
          alert("Item deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangeValue = (key, value) => {
    setInfo((prev) => ({
      ...prev,
      itemData: {
        ...prev.itemData,
        [key]: value,
      },
    }));
  };

  return (
    <div className="items">
      <div className="items-header">
        <h1>Items</h1>
        <button className="add-item-btn" onClick={handleAddItem}>
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="items-table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount Price</th>
              <th>Rating</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Data?.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.images?.[0]?.url ? (
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      className="item-image"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <Package size={20} />
                  )}
                </td>
                <td className="item-name">
                  <div className="item-info">
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="item-category">{item.category}</td>
                <td className="item-price">${item.price.toLocaleString()}</td>
                <td className="item-discount">
                  ${item.discountPrice.toLocaleString()}
                </td>
                <td className="item-rating">{item.rating} ⭐</td>
                <td className="item-availability">{item.availability}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditItem(item._id)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteItem(item._id, item.name)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Data.length === 0 && (
        <div className="no-items">
          <Package size={48} className="no-items-icon" />
          <h3>No items found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      <ItemsModal
        isOpen={info?.showAddItemModel}
        onClose={handleCloseModel}
        handleChangeValue={handleChangeValue}
        formData={itemsId}
        actionType={info?.actionType}
        activeTab={info?.activeButton}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Items;
