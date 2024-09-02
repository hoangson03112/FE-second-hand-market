import * as React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import { Footer } from "./Footer";
import "./Home.css";
import axios from "axios";
import { Loading } from "./Loading";

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:2000/ecomarket/categories")
      .then((response) => {
        console.log("Data received:", response.data.data);
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setLoading(false);
  }, []);

  return (
    <div>
      <Loading loading={loading} />
      <Header></Header>
      <div className="container-fluid p-0 text-white text-center">
        <div
          id="carouselExampleRide"
          className="carousel slide"
          data-bs-ride="true"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/images/slide1.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="/images/slide2.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleRide"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleRide"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="container my-5">
        <h3 className=" my-3 fw-semibold">Danh mục yêu thích</h3>
        <p class="text-body-secondary">
          Đồ cũ và mới chất lượng tốt. 1000+ sản phẩm được thêm vào mỗi tuần.
        </p>

        <div className="row">
          <div className="col-2 text-center">
            <div
              className="col-lg-3 col-md-6 m-4 d-flex justify-content-center align-items-center rounded-circle  shadow-lg "
              style={{ width: "150px", height: "150px" }} // Đảm bảo chiều rộng và chiều cao bằng nhau
            >
              <img
                src="https://static.oreka.vn/d/_next/static/images/free-items-118b7d85f3dc69896f282b27ba4724a6.png"
                alt="Đồ miễn phí"
                className=""
                style={{ width: "70px", height: "100px", objectFit: "cover" }} // Đảm bảo ảnh phủ đầy phần tử và giữ được hình tròn
              />
            </div>
            <span className="">Đồ miễn phí</span>
          </div>

          {categories?.map((category, index) => (
            <div key={index} className="col-2 text-center">
              <div
                className="col-lg-3 col-md-6 m-4 d-flex justify-content-center align-items-center rounded-circle  shadow-lg "
                style={{ width: "150px", height: "150px" }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className=""
                  style={{
                    width: "115px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="container my-5">
        <h3>Sản phẩm mới đăng</h3>
        <a className="text-decoration-none" href="/">
          <p class="text-end">Xem tất cả</p>
        </a>
        <div className="row">
          {" "}
          <div className="col card p-0 m-2" style={{ width: "16rem" }}>
            <img
              src="https://static.oreka.vn/250-250_8b23c28d-205a-4bb4-8cfd-5d8d628d62f0"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text text-truncate">
                Khuôn silicon làm bánh kẹp, bánh quế loại 13 cm – Mã số 1319
              </p>
              <h5 className="card-title">100000đ</h5>
              <p className="m-0 text-end">
                <i className="bi bi-geo-alt-fill text-danger"></i> Hà Nội
              </p>
            </div>
          </div>
          <div className=" col card p-0 m-2" style={{ width: "16rem" }}>
            <img
              src="https://static.oreka.vn/250-250_8b23c28d-205a-4bb4-8cfd-5d8d628d62f0"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text text-truncate">
                Khuôn silicon làm bánh kẹp, bánh quế loại 13 cm – Mã số 1319
              </p>
              <h5 className="card-title">100000đ</h5>
              <p className="m-0 text-end">
                <i className="bi bi-geo-alt-fill text-danger"></i> Hà Nội
              </p>
            </div>
          </div>
          <div className="col card p-0 m-2" style={{ width: "16rem" }}>
            <img
              src="https://static.oreka.vn/250-250_8b23c28d-205a-4bb4-8cfd-5d8d628d62f0"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text text-truncate">
                Khuôn silicon làm bánh kẹp, bánh quế loại 13 cm – Mã số 1319
              </p>
              <h5 className="card-title">100000đ</h5>
              <p className="m-0 text-end">
                <i className="bi bi-geo-alt-fill text-danger"></i> Hà Nội
              </p>
            </div>
          </div>
          <div className="col card p-0 m-2" style={{ width: "16rem" }}>
            <img
              src="https://static.oreka.vn/250-250_8b23c28d-205a-4bb4-8cfd-5d8d628d62f0"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text text-truncate">
                Khuôn silicon làm bánh kẹp, bánh quế loại 13 cm – Mã số 1319
              </p>
              <h5 className="card-title">100000đ</h5>
              <p className="m-0 text-end">
                <i className="bi bi-geo-alt-fill text-danger"></i> Hà Nội
              </p>
            </div>
          </div>
          <div className="col card p-0 m-2" style={{ width: "16rem" }}>
            <img
              src="https://static.oreka.vn/250-250_8b23c28d-205a-4bb4-8cfd-5d8d628d62f0"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text text-truncate">
                Khuôn silicon làm bánh kẹp, bánh quế loại 13 cm – Mã số 1319
              </p>
              <h5 className="card-title">100000đ</h5>
              <p className="m-0 text-end">
                <i className="bi bi-geo-alt-fill text-danger"></i> Hà Nội
              </p>
            </div>
          </div>
          <div className="col card p-0 m-2" style={{ width: "16rem" }}>
            <img
              src="https://static.oreka.vn/250-250_8b23c28d-205a-4bb4-8cfd-5d8d628d62f0"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text text-truncate">
                Khuôn silicon làm bánh kẹp, bánh quế loại 13 cm – Mã số 1319
              </p>
              <h5 className="card-title">100000đ</h5>
              <p className="m-0 text-end">
                <i className="bi bi-geo-alt-fill text-danger"></i> Hà Nội
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};
