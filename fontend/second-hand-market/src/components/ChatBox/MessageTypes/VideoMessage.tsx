import React from "react";

interface Attachment {
  url?: string;
  type?: string;
}

interface VideoMessageProps {
  attachment: Attachment;
}

const VideoMessage: React.FC<VideoMessageProps> = ({ attachment }) => {
  const source = attachment.url || "";
  const fileType = attachment.type || "video/mp4";

  return (
    <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 10, overflow: "hidden", margin: 0, padding: 0 }}>
      <video
        controls
        controlsList="nodownload"
        style={{ width: 120, height: 120, objectFit: "contain", borderRadius: 10, background: "#fff", display: "block" }}
        onError={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          console.error("Error loading video:", source);
          e.currentTarget.poster = "https://via.placeholder.com/120x120?text=Video+Error";
        }}
      >
        <source src={source} type={fileType} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoMessage;
