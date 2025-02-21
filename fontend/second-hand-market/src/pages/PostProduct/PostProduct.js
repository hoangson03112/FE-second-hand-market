import React, { useEffect, useState } from "react";
import "./PostProduct.css";

import Select from "react-select";
import CategoryContext from "../../contexts/CategoryContext";

import axios from "axios";
import ButtonBack from './../../components/common/ButtomBack/ButtomBack';



const PostProduct = () => {
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [files, setFiles] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        price: "",
        brand: "",
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

                    reader.onload = () => resolve(reader.result); // Trả về base64
                    reader.onerror = (error) => reject(error);
                });
            })
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {


            console.log(product);



         
            const response = await axios.post(
                "http://localhost:2000/eco-market/product/create",
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm lên:", error);
        }
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await CategoryContext.getCategories();
                setCategories(categories);

            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://provinces.open-api.vn/api/?depth=1"
                );
                setProvinces(
                    response.data.map((data) => ({ value: data.name, label: data.name }))
                );
            } catch (err) {
                console.error("Error fetching Provinces:", err.message);
            }
        };

        fetchProvinces();
        fetchCategories();
    }, []);

    useEffect(() => {
        const processFiles = async () => {
            if (!files || files.length === 0) return;

            const encodedFiles = await convertFilesToBase64(files);
            const firstImage = encodedFiles.find(file => file.startsWith("data:image"));

            setProduct((prev) => ({
                ...prev,
                images: encodedFiles, // Mã hóa tất cả ảnh & video
                avatar: firstImage || null, // Ảnh đầu tiên hợp lệ hoặc null
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
            <div className="form-container  ">
                <ButtonBack url="http://localhost:3000/eco-market/home" />
                <h2 className="form-title ">Đăng sản phẩm mới</h2>
                <p className="text-gray-600 mb-4 text-center">
                    Mô tả các mặt hàng một cách trung thực và nhận được khoản thanh toán đảm bảo 100%.
                </p>

                <form noValidate onSubmit={handleSubmit} className="form-content row mt-3">
                    <div className="mb-4">
                        <label className="form-label">
                            Ảnh và video <span className="text-danger">*</span>
                        </label>
                        <div
                            className="border border-2 border-dashed rounded p-4 text-center"

                            style={{ cursor: "pointer" }}
                        >
                            {files.length > 0 && (
                                <div className="mt-3 d-flex flex-wrap gap-3">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="position-relative"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                overflow: "hidden",
                                                borderRadius: "8px",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            }}
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
                                                    <source src={URL.createObjectURL(file)} type={file.type} />
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
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div onClick={() => document.getElementById("fileInput").click()}>
                                <i className="bi bi-camera mb-2 fs-1"></i>
                                <p className="text-muted mb-0">Tải lên hình ảnh và video</p>
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


                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="name">Tên sản phẩm</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input-custom"
                                placeholder="Nhập tên sản phẩm"
                                value={product.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Giá sản phẩm (VNĐ)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                className="input-custom"
                                placeholder="Nhập giá sản phẩm"
                                value={product.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Danh mục</label>
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
                            />
                        </div>
                        {product.categoryId !== "" ? (
                            <div className="form-group">
                                <label htmlFor="category">Danh mục con</label>
                                <Select
                                    options={subCategoryOptions}
                                    value={subCategoryOptions.find(
                                        (option) => option.value === product.subcategoryId
                                    )}
                                    onChange={handleChangeSubCategoryOptions}
                                    placeholder="Chọn danh mục con"
                                    isClearable
                                />
                            </div>
                        ) : (
                            ""
                        )}


                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="brand">Thương hiệu</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                className="input-custom"
                                placeholder="Nhập thương hiệu"
                                value={product.brand}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="brand">Nơi bán</label>
                            <Select
                                name="location"
                                options={provinces}
                                value={provinces.find(
                                    (option) => option.value === product.location
                                )}
                                onChange={(e) => {
                                    setProduct((prev) => ({
                                        ...prev,
                                        location: e.value,
                                    }))
                                }}
                                isSearchable
                                placeholder="Tìm kiếm..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Mô tả sản phẩm</label>
                            <textarea
                                id="description"
                                name="description"
                                className="input-custom"
                                rows="4"
                                placeholder="Nhập mô tả sản phẩm"
                                value={product.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="text-end">
                        <button type="submit" className="btn-custom " style={{ width: "15rem", height: "3.5rem" }}>
                            Đăng sản phẩm
                        </button>
                    </div>



                </form>
            </div>
        </div>
    );
};

export default PostProduct;
