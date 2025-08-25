import Modal from "react-modal";

const ReactModal = ({ isOpen, onClose, children }) => {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(71, 71, 71, 0.6)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      borderRadius: "12px",
      padding: "20px",
      border: "1px solid #ddd",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      backgroundColor: "#fff",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Centered Modal"
      style={customStyles}
      ariaHideApp={false}
    >
      {children}
    </Modal>
  );
};

export default ReactModal;
