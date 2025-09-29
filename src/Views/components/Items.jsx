import { useState, useEffect, useContext, useCallback, useRef } from "react";
import context from "../../Context/context";
import { Search, Plus, Edit, Package, Trash2 } from "lucide-react";
import { message } from "antd";

import "./Items.css";
import ItemsModal from "./Modal/ItemsModal";
import DeleteModal from "./Modal/DeleteModal";

const initialData = {
  name: "",
  category: "",
  price: "",
  discountPrice: "",
  rating: "",
  availability: "",
  weight: "",
  images: [],
  description: "",
  specifications: [],
  ratingBreajdown: {},
};

const Items = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const {
    items: {
      getItems,
      items,
      getItemsId,
      itemsId,
      getItemsDelete,
      deleteImage,
      loading,
      hasMore,
      currentPage,
      searchTerm: contextSearchTerm,
    },
  } = useContext(context);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [info, setInfo] = useState({
    ...initialData,
    showAddItemModel: false,
    itemData: initialData,
    actionType: "",
    activeButton: "add",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    item: null,
    isLoading: false,
    isDeleting: false,
  });

  // Infinite scroll observer
  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreItems = async () => {
    if (!loading && hasMore) {
      await getItems(currentPage + 1, true, debouncedSearchTerm);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search
  useEffect(() => {
    if (debouncedSearchTerm !== contextSearchTerm) {
      getItems(1, false, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!items && !debouncedSearchTerm) {
      getItems(1, false, "");
    }
  }, []);

  let Data = items || [];

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

  const handleDeleteItem = async (itemId) => {
    try {
      setDeleteModalState((prev) => ({
        ...prev,
        isOpen: true,
        isLoading: true,
        item: null,
      }));

      const itemResponse = await getItemsId(itemId);
      if (itemResponse?.item) {
        setDeleteModalState((prev) => ({
          ...prev,
          item: itemResponse.item,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      setDeleteModalState((prev) => ({
        ...prev,
        isOpen: false,
        isLoading: false,
      }));
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState((prev) => ({
      ...prev,
      isOpen: false,
      item: null,
      isLoading: false,
      isDeleting: false,
    }));
  };

  const handleConfirmDelete = async () => {
    const { item } = deleteModalState;
    if (!item) return;

    // Show initial loading message
    const loadingKey = "deleteItem";
    let loadingMessage;

    try {
      setDeleteModalState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      // First, delete all images if they exist
      if (item.images && item.images.length > 0) {
        console.log(
          `Deleting ${item.images.length} images for item: ${item.name}`
        );

        // Show loading message for image deletion
        loadingMessage = messageApi.loading(
          `Deleting ${item.images.length} image(s)...`,
          0
        );

        for (const image of item.images) {
          if (image.publicId) {
            try {
              const publicIdParts = image.publicId.split("/");
              const filename = publicIdParts[publicIdParts.length - 1];

              await deleteImage(filename);
              console.log(`Successfully deleted image: ${filename}`);
            } catch (error) {
              console.error(`Failed to delete image ${image.publicId}:`, error);
              // Continue with other images even if one fails
            }
          }
        }
      }

      // Show loading message for item deletion
      if (loadingMessage) {
        loadingMessage();
      }
      loadingMessage = messageApi.loading(`Deleting item record...`, 0);

      // Then delete the item
      const deleteResponse = await getItemsDelete(item._id);
      if (deleteResponse) {
        // Refresh the items list after successful deletion
        await getItems(1, false, debouncedSearchTerm);

        // Close loading message and show success
        if (loadingMessage) {
          loadingMessage();
        }
        messageApi.success(
          `${item.name} and associated images deleted successfully!`,
          3
        );

        // Close modal
        setDeleteModalState((prev) => ({
          ...prev,
          isOpen: false,
          item: null,
          isLoading: false,
          isDeleting: false,
        }));
      }
    } catch (error) {
      console.error("Error deleting item:", error);

      // Close loading message and show error
      if (loadingMessage) {
        loadingMessage();
      }
      messageApi.error(`Failed to delete ${item.name}. Please try again.`, 4);

      // Reset deleting state on error
      setDeleteModalState((prev) => ({
        ...prev,
        isDeleting: false,
      }));
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {contextHolder}
      <div className="items">
        <div className="items-header">
          <div className="header-content">
            <h1>Items</h1>
            <p>Manage your inventory</p>
          </div>
          <button className="add-item-btn" onClick={handleAddItem}>
            <Plus size={20} />
            Add Item
          </button>
        </div>

        <div className="search-section">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearchChange}
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
                <th>Weight</th>
                {/* <th>Price</th>
                <th>Discount Price</th> */}
                <th>Rating</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Data?.map((item, index) => {
                if (Data.length === index + 1) {
                  return (
                    <tr key={item._id} ref={lastItemRef}>
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
                      <td className="item-weight">{item?.weight || "N/A"}</td>

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
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
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
                      <td className="item-weight">{item?.weight || "N/A"}</td>
                      {/* <td className="item-price">
                        ${item.price.toLocaleString()}
                      </td>
                      <td className="item-discount">
                        ${item.discountPrice.toLocaleString()}
                      </td> */}
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
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="loading-more">
            <div className="spinner"></div>
            <p>Loading more items...</p>
          </div>
        )}

        {Data.length === 0 && !loading && (
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
          onSuccess={() => getItems(1, false, debouncedSearchTerm)}
        />

        <DeleteModal
          isOpen={deleteModalState.isOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          item={deleteModalState.item}
          isLoading={deleteModalState.isLoading}
          isDeleting={deleteModalState.isDeleting}
        />
      </div>
    </>
  );
};

export default Items;
