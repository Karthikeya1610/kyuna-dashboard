import React, { useEffect } from "react";
import "./MessageBanner.css";

const MessageBanner = ({
  type,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
}) => {
  if (!message) return null;

  // Auto-close success messages after specified delay
  useEffect(() => {
    if (autoClose && type === "success" && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, type, onClose, autoCloseDelay]);

  return (
    <div className={`message-banner ${type}`}>
      <div className="message-content">
        <span className="message-icon">{type === "success" ? "✓ " : "!"}</span>
        <span className="message-text">{message}</span>
      </div>
      {onClose && (
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default MessageBanner;
