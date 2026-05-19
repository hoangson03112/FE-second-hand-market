import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface DeleteConfirmProps {
  showDeleteConfirm: boolean;
  cancelDeleteMessage: () => void;
  confirmDeleteMessage: () => void;
}

export default function DeleteConfirm({
  showDeleteConfirm,
  cancelDeleteMessage,
  confirmDeleteMessage,
}: DeleteConfirmProps) {
  return (
    <div>
      {showDeleteConfirm && (
        <Modal
          open={showDeleteConfirm}
          onClose={cancelDeleteMessage}
          aria-labelledby="delete-confirmation-modal"
          closeAfterTransition
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              id="delete-confirmation-modal"
              variant="h6"
              component="h2"
            >
              Xác nhận xóa
            </Typography>
            <Typography>Bạn có chắc chắn muốn xóa tin nhắn này?</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                onClick={cancelDeleteMessage}
                color="inherit"
                variant="outlined"
              >
                Hủy
              </Button>
              <Button
                onClick={confirmDeleteMessage}
                color="error"
                variant="contained"
              >
                Xóa
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}
