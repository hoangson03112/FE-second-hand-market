import React, { useState } from "react";

const ImageMessage = ({ attachment, setFullscreenImage }) => {
  const source = attachment.url || "";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      key={attachment.id || attachment._id}
      className="media-message image-message"
      onClick={() => {
        setFullscreenImage(source);
      }}
    >
      <div
        className="media-preview"
        style={{ position: "relative" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="media-overlay media-fullscreen-btn"
          onClick={(e) => {
            e.stopPropagation();
            setFullscreenImage(source);
          }}
        ></div>
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              zIndex: 1,
              transition: "background-color 0.3s ease",
            }}
          />
        )}
        <img
          src={source}
          alt={attachment.name || "Image attachment"}
          loading="lazy"
          style={{
            position: "relative",
            zIndex: 0,
          }}
          onError={(e) => {
            console.error("Error loading image:", source);
            e.target.src =
              "https://via.placeholder.com/300x200?text=Image+Not+Found";
          }}
        />
      </div>
    </div>
  );
};

export default ImageMessage;
