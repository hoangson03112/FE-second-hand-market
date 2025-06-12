import React from 'react'
import { Snackbar, Alert, Box, Typography } from '@mui/material'

export default function Notification({ showToast, setShowToast, message }) {
    return (
        <Snackbar
            open={showToast}
            autoHideDuration={3000}
            onClose={() => setShowToast(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            sx={{
                position: "fixed",
                bottom: "40px",
                right: "20px",
                minWidth: "350px",
            }}
        >
            <Alert
                onClose={() => setShowToast(false)}
                severity="success"
                sx={{ width: "100%" }}
            >
                <Box className="d-flex align-items-center">

                    <Typography>{message}</Typography>
                </Box>
            </Alert>
        </Snackbar>
    )
}
