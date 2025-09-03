import { useState, useContext, useEffect } from "react";
import ReactModal from "./modal";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import context from "../../../Context/context";

const { TextArea } = Input;
const { Dragger } = Upload;

const ItemsModal = ({ isOpen, onClose, actionType, isLoading, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]); // Track deleted images

  const {
    items: {
      uploadImage,
      getItemsCreate,
      getItemsUpdate,
      itemsId,
      deleteImage,
    },
  } = useContext(context);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(itemsId?.item);
    // Clear deleted images when modal opens with new data
    setDeletedImages([]);
  }, [itemsId]);

  // Clear deleted images when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDeletedImages([]);
    }
  }, [isOpen]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSpecChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const handleUploadChange = ({ fileList }) => {
    console.log("File list:", fileList);

    // Get the current images from formData
    const currentImages = formData.images || [];

    // Find images that were removed (they exist in currentImages but not in fileList)
    const removedImages = currentImages.filter((currentImg) => {
      // Check if this image is no longer in the fileList
      return !fileList.some((file) => {
        // For existing images, check by publicId
        if (currentImg.publicId && file.uid === currentImg.publicId) {
          return true;
        }
        // For new images, check by uid
        if (currentImg.uid && file.uid === currentImg.uid) {
          return true;
        }
        return false;
      });
    });

    // Add removed images to deletedImages state if they have publicId (server images)
    const imagesToDelete = removedImages.filter(
      (img) => img.publicId && img.url?.startsWith("http")
    );
    if (imagesToDelete.length > 0) {
      setDeletedImages((prev) => {
        // Avoid duplicates by checking if image is already in deletedImages
        const newDeletedImages = [...prev];
        imagesToDelete.forEach((img) => {
          if (
            !newDeletedImages.some(
              (deletedImg) => deletedImg.publicId === img.publicId
            )
          ) {
            newDeletedImages.push(img);
          }
        });
        return newDeletedImages;
      });
    }

    setFormData((prev) => ({
      ...prev,
      images: fileList.map((file) => ({
        uid: file.uid,
        name: file.name,
        url: file.url || URL.createObjectURL(file.originFileObj),
        publicId: file.uid,
        originFileObj: file.originFileObj,
      })),
    }));

    // Remove images from deletedImages state if they are re-added
    setDeletedImages((prev) => {
      return prev.filter((deletedImg) => {
        // If this deleted image is found in the current fileList, it was re-added
        const wasReAdded = fileList.some((file) => {
          if (deletedImg.publicId && file.uid === deletedImg.publicId) {
            return true; // Image was re-added
          }
          return false;
        });
        // Keep the image in deletedImages only if it was NOT re-added
        return !wasReAdded;
      });
    });
  };

  console.log("actionType:", actionType);
  console.log("Deleted images:", deletedImages);
  console.log("Current formData images:", formData?.images);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const uploadedImages = [];

      for (const img of formData.images) {
        if (img?.url?.startsWith("http") && !img.originFileObj) {
          uploadedImages.push({ url: img.url, publicId: img.publicId });
          continue;
        }

        if (
          img.originFileObj instanceof File ||
          img.originFileObj instanceof Blob
        ) {
          const fd = new FormData();
          fd.append("image", img.originFileObj);

          const res = await uploadImage(fd);
          console.log("Image upload response:", res);

          uploadedImages.push({
            url: res?.url,
            publicId: res.publicId,
          });
        } else {
          console.warn("Image missing file and url, skipping:", img);
        }
      }

      // Prepare the payload with uploaded images
      const payload = {
        ...formData,
        images: uploadedImages,
      };

      if (actionType === "edit") {
        const updateResponse = await getItemsUpdate(formData._id, payload);

        if (updateResponse) {
          // Delete the removed images from server after successful update
          if (deletedImages.length > 0) {
            console.log(
              `Deleting ${deletedImages.length} removed images from server`
            );
            for (const deletedImg of deletedImages) {
              try {
                if (deletedImg.publicId) {
                  const publicIdParts = deletedImg.publicId.split("/");
                  const filename = publicIdParts[publicIdParts.length - 1];
                  await deleteImage(filename);
                  console.log(`Successfully deleted image: ${filename}`);
                }
              } catch (error) {
                console.error(
                  `Failed to delete image ${deletedImg.publicId}:`,
                  error
                );
                // Continue with other images even if one fails
              }
            }
          }

          message.success("Item updated successfully!");
          onSuccess && onSuccess(); // Refresh the items list
          onClose();
          setDeletedImages([]); // Clear deleted images state
        }
      } else {
        const createResponse = await getItemsCreate(payload);

        if (createResponse) {
          message.success("Item created successfully!");
          onSuccess && onSuccess(); // Refresh the items list
          onClose();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to submit form!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDeletedImages([]); // Clear deleted images when modal is closed
    onClose();
  };

  return (
    <ReactModal isOpen={isOpen} onClose={handleClose}>
      {isLoading ? (
        <Spin
          size="large"
          tip="Loading..."
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
            width: "100%",
          }}
        />
      ) : (
        <Form layout="vertical" style={{ maxWidth: 650, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>
            Add / Edit Item
          </h2>

          <Form.Item label="Name" required>
            <Input
              value={formData?.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Category" required>
            <Input
              value={formData?.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Price" required>
                <InputNumber
                  style={{ width: "100%" }}
                  value={formData?.price}
                  min={0}
                  onChange={(value) => handleChange("price", value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Discount Price" required>
                <InputNumber
                  style={{ width: "100%" }}
                  value={formData?.discountPrice}
                  min={0}
                  onChange={(value) => handleChange("discountPrice", value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Availability" required>
            <Input
              value={formData?.availability}
              onChange={(e) => handleChange("availability", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Images" required>
            <Dragger
              multiple
              accept="image/*"
              listType="picture"
              beforeUpload={() => false} // Prevent automatic upload
              customRequest={() => {}} // Custom request handler to prevent default
              fileList={formData?.images?.map((img) => ({
                uid: img?.publicId,
                name: img?.publicId,
                status: "done",
                url: img?.url,
              }))}
              onChange={handleUploadChange}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag images to this area to upload
              </p>
            </Dragger>
            {deletedImages.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  backgroundColor: "#fff2e8",
                  border: "1px solid #ffbb96",
                  borderRadius: 4,
                  fontSize: "12px",
                  color: "#d46b08",
                }}
              >
                ⚠️ {deletedImages.length} image(s) will be permanently deleted
                when you save changes
              </div>
            )}
          </Form.Item>

          <Form.Item label="Description">
            <TextArea
              rows={3}
              value={formData?.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Form.Item>

          <h3 style={{ marginTop: 20 }}>Specifications</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Carat">
                <Input
                  value={formData?.specifications?.carat}
                  onChange={(e) => handleSpecChange("carat", e.target.value)}
                />
              </Form.Item>
            </Col>
            x
            <Col span={12}>
              <Form.Item label="Clarity">
                <Input
                  value={formData?.specifications?.clarity}
                  onChange={(e) => handleSpecChange("clarity", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Color">
                <Input
                  value={formData?.specifications?.color}
                  onChange={(e) => handleSpecChange("color", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Metal">
                <Input
                  value={formData?.specifications?.metal}
                  onChange={(e) => handleSpecChange("metal", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={handleClose} style={{ marginRight: 10 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      )}
    </ReactModal>
  );
};

export default ItemsModal;
