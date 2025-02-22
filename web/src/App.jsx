import React, { useState } from "react";
import { Upload, Button, message, Typography } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons/lib/icons";
import axios from "axios";

const { Title, Paragraph } = Typography;

const App = () => {
  const [fileList, setFileList] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState("aggregated.xlsx");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng tải lên ít nhất một tệp Excel.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const filename = response.headers["content-disposition"]?.split("filename=")[1]?.replace(/\"/g, "") || "aggregated.xlsx";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setDownloadFilename(filename);
      message.success("Tải lên thành công, bạn có thể tải file về!");
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải lên file.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, textAlign: "center", maxWidth: 600, margin: "auto" }}>
      <Title level={3}>Tổng hợp Excel</Title>
      <Paragraph>
        Chọn một file Excel để tải lên, hệ thống sẽ xử lý và tổng hợp kết quả ở tất cả các sheet.
      </Paragraph>
      <Upload
        multiple
        beforeUpload={() => false}
        onChange={({ fileList }) => setFileList(fileList)}
        fileList={fileList}
      >
        <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
      </Upload>
      <br />
      <Button type="primary" onClick={handleUpload} loading={loading} style={{ marginTop: 10 }}>
        Xử lý
      </Button>
      {downloadUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={downloadUrl} download={downloadFilename}>
            <Button type="dashed" icon={<DownloadOutlined />}>Tải file về</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
