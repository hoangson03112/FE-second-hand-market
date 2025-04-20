import React, { useEffect, useState } from "react";
import "./PostProduct.css";
import Select from "react-select";
import CategoryContext from "../../contexts/CategoryContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonBack from "./../../components/common/ButtomBack/ButtomBack";
import Swal from "sweetalert2";
import { useCategory } from "../../contexts/CategoryContext";
import AppContext from "../../contexts/AppContext";
import { useProduct } from "../../contexts/ProductContext";
const PostProduct = () => {
  const { getCategories } = useCategory();
  const { postProduct } = useProduct();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [files, setFiles] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    brand: "",
    stock: 0,
    description: "",
    categoryId: "",
    images: [],
    subcategoryId: "",
    location: "",
    avatar: "",
  });

  const categoryOptions = categories.map((cate) => ({
    value: cate._id,
    label: cate.name,
  }));

  const subCategoryOptions =
    categories
      .find(
        (cate) => product.categoryId !== "" && cate._id === product.categoryId
      )
      ?.subcategories.map((sub) => ({ value: sub._id, label: sub.name })) || [];

  const handleChangeCategoryOptions = (selectedOption) => {
    setProduct({ ...product, categoryId: selectedOption?.value || "" });
  };
  const handleChangeSubCategoryOptions = (selectedOption) => {
    setProduct({ ...product, subcategoryId: selectedOption?.value || "" });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const convertFilesToBase64 = (files) => {
    return Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postProduct(product);

      if (response.message) {
        Swal.fire({
          title: "Thêm thành công!",
          text: "Vui lòng chờ duyệt!",
          icon: "success",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm lên:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const getProvinces = async () => {
      try {
        const response = await AppContext.fetchProvinces();

        setProvinces(
          response.map((data) => ({ value: data.name, label: data.name }))
        );
      } catch (err) {
        console.error("Error fetching Provinces:", err.message);
      }
    };

    getProvinces();
    fetchCategories();
  }, []);

  useEffect(() => {
    const processFiles = async () => {
      if (!files || files.length === 0) return;

      const encodedFiles = await convertFilesToBase64(files);
      const firstImage = encodedFiles.find((file) =>
        file.startsWith("data:image")
      );

      setProduct((prev) => ({
        ...prev,
        images: encodedFiles,
        avatar: firstImage || null,
      }));
    };

    processFiles();
  }, [files]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        document.getElementById("fileInput").value = "";
      }
      return newFiles;
    });
  };

  return (
    <div className="sell-product-page">
      <div className="form-container shadow p-4 rounded-3 bg-white">
        <ButtonBack url="/eco-market/home" />
        <h2 className="form-title text-center mb-3">Đăng sản phẩm mới</h2>
        <p className="text-gray-600 mb-4 text-center">
          Mô tả các mặt hàng một cách trung thực và nhận được khoản thanh toán
          đảm bảo 100%.
        </p>

        <form noValidate onSubmit={handleSubmit} className="form-content mt-4">
          <div className="mb-5">
            <label className="form-label fw-bold fs-5 mb-3">
              Ảnh và video <span className="text-danger">*</span>
            </label>
            <div
              className="border border-2 border-dashed rounded-3 p-4 text-center bg-light"
              style={{ cursor: "pointer" }}
            >
              {files.length > 0 && (
                <div className="mt-3 d-flex flex-wrap gap-3 justify-content-center">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="position-relative"
                      style={{
                        width: "150px",
                        height: "150px",
                        overflow: "hidden",
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                        transition: "transform 0.2s",
                        margin: "5px",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        >
                          <source
                            src={URL.createObjectURL(file)}
                            type={file.type}
                          />
                        </video>
                      ) : null}
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="btn btn-danger btn-sm"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          borderRadius: "50%",
                          padding: "2px 6px",
                          fontSize: "12px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div
                onClick={() => document.getElementById("fileInput").click()}
                className="py-4"
              >
                <i className="bi bi-camera mb-2 fs-1"></i>
                <p className="fw-bold mb-0">Tải lên hình ảnh và video</p>
                <p className="text-muted small">
                  Hình ảnh đẹp sẽ giúp sản phẩm của bạn nổi bật hơn
                </p>
              </div>
            </div>
            <input
              id="fileInput"
              type="file"
              className="d-none"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          <div className="row">
            <h5 className="mb-4 mt-2 pb-2 border-bottom fw-bold">
              Thông tin sản phẩm
            </h5>
            <div className="col-md-6 pe-md-4">
              <div className="form-group mb-4">
                <label htmlFor="name" className="fw-bold mb-2">
                  Tên sản phẩm <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-custom form-control form-control-lg rounded-3"
                  placeholder="Nhập tên sản phẩm"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="price" className="fw-bold mb-2">
                  Giá sản phẩm (VNĐ) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="input-custom form-control form-control-lg rounded-3"
                  placeholder="Nhập giá sản phẩm"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="stock" className="fw-bold mb-2">
                  Số lượng <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  className="input-custom form-control form-control-lg rounded-3"
                  placeholder="Nhập số lượng sản phẩm"
                  value={product.stock}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="brand" className="fw-bold mb-2">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  className="input-custom form-control form-control-lg rounded-3"
                  placeholder="Nhập thương hiệu"
                  value={product.brand}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-6 ps-md-4">
              <div className="form-group mb-4">
                <label htmlFor="category" className="fw-bold mb-2">
                  Danh mục <span className="text-danger">*</span>
                </label>
                <Select
                  id="category"
                  name="category"
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (option) => option.value === product.categoryId
                  )}
                  onChange={handleChangeCategoryOptions}
                  placeholder="Chọn danh mục"
                  isClearable
                  className="basic-select"
                  classNamePrefix="select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      height: "48px",
                      borderRadius: "0.3rem",
                    }),
                  }}
                />
              </div>

              {product.categoryId !== "" && (
                <div className="form-group mb-4">
                  <label htmlFor="subcategory" className="fw-bold mb-2">
                    Danh mục con
                  </label>
                  <Select
                    id="subcategory"
                    options={subCategoryOptions}
                    value={subCategoryOptions.find(
                      (option) => option.value === product.subcategoryId
                    )}
                    onChange={handleChangeSubCategoryOptions}
                    placeholder="Chọn danh mục con"
                    isClearable
                    className="basic-select"
                    classNamePrefix="select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: "48px",
                        borderRadius: "0.3rem",
                      }),
                    }}
                  />
                </div>
              )}

              <div className="form-group mb-4">
                <label htmlFor="location" className="fw-bold mb-2">
                  Nơi bán <span className="text-danger">*</span>
                </label>
                <Select
                  id="location"
                  name="location"
                  options={provinces}
                  value={provinces.find(
                    (option) => option.value === product.location
                  )}
                  onChange={(e) => {
                    setProduct((prev) => ({
                      ...prev,
                      location: e.value,
                    }));
                  }}
                  isSearchable
                  placeholder="Tìm kiếm..."
                  className="basic-select"
                  classNamePrefix="select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      height: "48px",
                      borderRadius: "0.3rem",
                    }),
                  }}
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="description" className="fw-bold mb-2">
                  Mô tả sản phẩm <span className="text-danger">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="input-custom form-control rounded-3"
                  rows="5"
                  placeholder="Nhập mô tả sản phẩm"
                  value={product.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold"
              style={{
                background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                border: "none",
                boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                transition: "all 0.3s ease",
                fontSize: "1.1rem",
                letterSpacing: "0.5px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(13, 110, 253, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(13, 110, 253, 0.3)";
              }}
            >
              Đăng sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;
