import React from "react";
import { Typography, IconButton, Box } from "@mui/material";
import { Search } from "@mui/icons-material";

const VideoMessage = ({ attachment }) => {
  const source = attachment.url || "";
  const fileType = attachment.type || "video/mp4";

  return (
    <div className="media-message video-message">
      <div className="media-preview video-preview">
        <video
          controls
          controlsList="nodownload"
          className="chat-video-player"
          onError={(e) => {
            console.error("Error loading video:", source);
            e.target.poster =
              "https://via.placeholder.com/300x200?text=Video+Error";
          }}
        >
          <source src={source} type={fileType} />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoMessage;
