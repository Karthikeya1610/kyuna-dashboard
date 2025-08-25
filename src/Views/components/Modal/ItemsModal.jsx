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

const ItemsModal = ({ isOpen, onClose, actionType, isLoading }) => {
  const [loading, setLoading] = useState(false);

  const {
    items: { uploadImage, getItemsCreate, getItemsUpdate, itemsId },
  } = useContext(context);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setFormData(itemsId?.item);
  }, [itemsId]);

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
  };

  console.log("actionType:", actionType);

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

      if (actionType === "edit") {
        const updateResponse = await getItemsUpdate(
          formData.itemData._id,
          formData
        );

        if (updateResponse) {
          message.success("Item updated successfully!");
          onClose();
        }
      } else {
        const createResponse = await getItemsCreate(finalPayload);

        if (createResponse) {
          message.success("Item created successfully!");
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

  return (
    <ReactModal isOpen={isOpen} onClose={onClose}>
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
            <Button onClick={onClose} style={{ marginRight: 10 }}>
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
