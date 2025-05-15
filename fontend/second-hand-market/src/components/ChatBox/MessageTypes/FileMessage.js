import React from 'react';
import { Chip } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';

const FileMessage = ({ attachment }) => {
  const source = attachment.url || '';
  
  return (
    <Chip
      icon={<InsertDriveFile />}
      label={attachment.name || "File attachment"}
      variant="outlined"
      component="a"
      href={source}
      target="_blank"
      rel="noopener noreferrer"
      clickable
      className="file-attachment-chip"
    />
  );
};

export default FileMessage; 