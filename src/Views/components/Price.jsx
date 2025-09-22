import React, { useState, useEffect, useContext } from "react";
import Context from "../../Context/context";
import "./Price.css";

const Price = () => {
  const [formData, setFormData] = useState({
    originalPrice: "",
    discountedPrice: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const {
    price: { getPrice, price, updatePrice, loading },
  } = useContext(Context);

  useEffect(() => {
    if (Price) {
      getPrice();
    }
  }, []);

  console.log(price, "this is the price====>");

  useEffect(() => {
    // Update form data when price data is loaded
    if (price) {
      setFormData({
        originalPrice: price.originalPrice || "",
        discountedPrice: price.discountedPrice || "",
      });
    }
  }, [price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      originalPrice: price?.originalPrice || "",
      discountedPrice: price?.discountedPrice || "",
    });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.originalPrice || !formData.discountedPrice) {
      setMessage("Please fill in all fields");
      return;
    }

    if (
      parseFloat(formData.discountedPrice) >= parseFloat(formData.originalPrice)
    ) {
      setMessage("Discounted price must be less than original price");
      return;
    }

    try {
      const result = await updatePrice(price?._id, {
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
      });

      if (result && !result.error) {
        setMessage("Price updated successfully!");
        setIsEditing(false);

        // Auto-close success message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setMessage("Failed to update price. Please try again.");
      }
    } catch (error) {
      setMessage("Error updating price. Please try again.");
    }
  };

  const calculateDiscount = () => {
    if (formData.originalPrice && formData.discountedPrice) {
      const original = parseFloat(formData.originalPrice);
      const discounted = parseFloat(formData.discountedPrice);
      const discount = ((original - discounted) / original) * 100;
      return discount.toFixed(1);
    }
    return 0;
  };

  return (
    <div className="price-container">
      <div className="price-header">
        <h2>Price Management</h2>
        <p>Manage your product pricing and discounts</p>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <div className="price-card">
        <div className="price-card-header">
          <h3>Current Pricing</h3>
          {!isEditing && (
            <button onClick={handleEdit} className="edit-btn">
              Edit Prices
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="price-form">
            <div className="form-group">
              <label htmlFor="originalPrice">Original Price (₹)</label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
                placeholder="Enter original price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="discountedPrice">Discounted Price (₹)</label>
              <input
                type="number"
                id="discountedPrice"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleInputChange}
                disabled={!isEditing}
                min="0"
                step="0.01"
                placeholder="Enter discounted price"
                required
              />
            </div>

            {formData.originalPrice && formData.discountedPrice && (
              <div className="discount-info">
                <div className="discount-percentage">
                  <span className="label">Discount:</span>
                  <span className="value">{calculateDiscount()}%</span>
                </div>
                <div className="savings">
                  <span className="label">You Save:</span>
                  <span className="value">
                    ₹
                    {(
                      parseFloat(formData.originalPrice) -
                      parseFloat(formData.discountedPrice)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="form-actions">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={price.loading}
                >
                  {price.loading ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Price;
