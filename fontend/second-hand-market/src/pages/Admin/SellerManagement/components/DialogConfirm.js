import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

export default function DialogConfirm({
  confirmDialogOpen,
  setConfirmDialogOpen,
  actionType,
  rejectionReason,
  setRejectionReason,
  handleApproveSeller,
  handleRejectSeller,
}) {
  return (
    <Dialog
      open={confirmDialogOpen}
      onClose={() => setConfirmDialogOpen(false)}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          mx: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 3 } }}>
        {actionType === "approve"
          ? "Xác nhận duyệt seller"
          : "Xác nhận từ chối seller"}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {actionType === "approve"
            ? "Bạn có chắc chắn muốn duyệt seller này?"
            : "Bạn có chắc chắn muốn từ chối seller này?"}
        </Typography>
        {actionType === "reject" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Lý do từ chối"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Button
          onClick={() => setConfirmDialogOpen(false)}
          sx={{
            borderRadius: "8px",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={
            actionType === "approve" ? handleApproveSeller : handleRejectSeller
          }
          variant="contained"
          color={actionType === "approve" ? "success" : "error"}
          sx={{
            borderRadius: "8px",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {actionType === "approve" ? "Duyệt" : "Từ chối"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
