import ReactModal from "./modal";
import { Button, Spin } from "antd";
import { Trash2, AlertTriangle } from "lucide-react";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  isLoading,
  isDeleting,
}) => {
  return (
    <ReactModal isOpen={isOpen} onClose={onClose}>
      {isLoading ? (
        <Spin
          size="large"
          tip="Loading item details..."
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
            width: "100%",
          }}
        />
      ) : (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertTriangle size={32} color="#dc2626" />
            </div>
            <h2 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>
              Delete Item
            </h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              This action cannot be undone. This will permanently delete the
              item and all associated data.
            </p>
          </div>

          {item && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>
                Item Details
              </h4>
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "#e5e7eb",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "#9ca3af" }}>No Image</span>
                  </div>
                )}
                <div>
                  <h5 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>
                    {item.name}
                  </h5>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    Category: {item.category}
                  </p>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                    Price: ${item.price?.toLocaleString()}
                  </p>
                  {item.images && item.images.length > 0 && (
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        color: "#dc2626",
                        fontSize: "12px",
                      }}
                    >
                      ⚠️ This item has {item.images.length} image(s) that will
                      also be deleted
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              textAlign: "right",
              gap: "12px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={onClose}
              disabled={isDeleting}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              icon={<Trash2 size={16} />}
              onClick={onConfirm}
              loading={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Item"}
            </Button>
          </div>
        </div>
      )}
    </ReactModal>
  );
};

export default DeleteModal;
