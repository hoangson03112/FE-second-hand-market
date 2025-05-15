import React from 'react';
import { IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const ImageMessage = ({ attachment, setFullscreenImage }) => {
  const source = attachment.url || '';
  
  return (
    <div
      key={attachment.id || attachment._id}
      className="media-message image-message"
      onClick={() => {
        setFullscreenImage(source);
      }}
    >
      <div className="media-preview">
        <div className="media-overlay">
          <IconButton
            className="media-fullscreen-btn"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(source);
            }}
          >
            <Search />
          </IconButton>
        </div>
        <img
          src={source}
          alt={attachment.name || "Image attachment"}
          loading="lazy"
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