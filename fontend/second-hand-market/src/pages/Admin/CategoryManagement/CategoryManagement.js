import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Slide } from "@mui/material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

import SubCategoryContext from "../../../contexts/SubCategoryContext";
import { useCategory } from "../../../contexts/CategoryContext";

const CategoryManagement = () => {
  const { getCategories, updateCategory } = useCategory();
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    status: "active",
  });
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [parentCategory, setParentCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const [parentCategoryToDelete, setParentCategoryToDelete] = useState(null);

  const handleOpenDeleteDialog = (subcategory, parentCategory) => {
    setSubcategoryToDelete(subcategory);
    setParentCategoryToDelete(parentCategory);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSubcategoryToDelete(null);
    setParentCategoryToDelete(null);
  };

  // Show notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Close notification
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Open dialog for add/edit category
  const handleOpenDialog = (
    category = null,
    isSubcat = false,
    parent = null
  ) => {
    setIsSubcategory(isSubcat);
    setParentCategory(parent);

    if (category) {
      setCurrentCategory({ ...category });
      setIsEditing(true);
    } else {
      setCurrentCategory({
        name: "",
        status: "active",
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedCategory = {
      ...currentCategory,
      [name]: value,
    };

    setCurrentCategory(updatedCategory);
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setCurrentCategory({
      ...currentCategory,
      status: e.target.value,
    });
  };

  // Save category (add or update)
  const handleSaveCategory = async () => {
    if (!currentCategory.name.trim()) {
      showSnackbar("Please enter category name", "error");
      return;
    }

    if (isEditing) {
      if (isSubcategory) {
        // Update existing subcategory

        updateSubcategory(currentCategory, parentCategory._id);
        showSnackbar("Subcategory updated successfully");
      } else {
        // Update existing main category
        handleUpdateCategory(currentCategory);
        showSnackbar("Category updated successfully");
      }
    } else {
      if (isSubcategory) {
        addSubcategory(currentCategory, parentCategory._id);
        showSnackbar("New subcategory added successfully");
      }
    }

    handleCloseDialog();
  };

  // Toggle expand/collapse subcategories
  const toggleExpand = (categoryId) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId],
    });
  };

  // Render subcategories
  const renderSubcategories = (category) => {
    if (!category.subcategories || category.subcategories.length === 0) {
      return null;
    }

    return category.subcategories.map((subcat) => (
      <ListItem key={subcat._id.$oid || subcat._id} sx={{ pl: 4 }}>
        <ListItemText primary={subcat.name} />
        <Chip
          label={subcat.status === "active" ? "Active" : "Inactive"}
          color={subcat.status === "active" ? "success" : "error"}
          size="small"
          sx={{ mr: 6 }}
        />
        <ListItemSecondaryAction>
          <IconButton
            color="primary"
            onClick={() => handleOpenDialog(subcat, true, category)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleOpenDeleteDialog(subcat, category)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));
  };
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showSnackbar("Failed to load categories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update an existing category
  const handleUpdateCategory = async (category) => {
    try {
      const response = await updateCategory(category._id, {
        name: category.name,
      });

      if (!response) {
        throw new Error("Lỗi cập nhật danh mục");
      }

      setCategories((prev) =>
        prev.map((cat) => (cat._id === category._id ? response : cat))
      );
      showSnackbar("Cập nhật danh mục thành công");
    } catch (error) {
      console.error("Error updating category:", error);
      showSnackbar("Lỗi cập nhật danh mục", "error");
    }
  };

  // Add a new subcategory
  const addSubcategory = async (subcategory, parentCategoryId) => {
    try {
      const response = await SubCategoryContext.addSubcategory(
        subcategory,
        parentCategoryId
      );

      if (!response) {
        throw new Error("Lỗi thêm danh muc phu");
      }

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === parentCategoryId ? response.category : cat
        )
      );

      showSnackbar("Thêm danh muc phu thành công");
    } catch (error) {
      console.error("Error adding subcategory:", error);
      showSnackbar("Lỗi thêm danh muc phu", "error");
    }
  };

  // Update an existing subcategory
  const updateSubcategory = async (subcategory, parentCategoryId) => {
    try {
      const response = await SubCategoryContext.updateSubcategory(
        subcategory,
        parentCategoryId
      );
      if (!response) {
        throw new Error("Cập nhật lỗi");
      }
      const updatedCategories = categories.map((cat) => {
        if (cat._id === parentCategoryId) {
          return response.category;
        }
        return cat;
      });
      setCategories(updatedCategories);
      showSnackbar("Cập nhật danh mục phụ thành công");
    } catch (error) {
      console.error("Error updating subcategory:", error);
      showSnackbar("Cập nhật lỗi", "error");
    }
  };
  const handleDeleteSubCategory = async (subcategoryId, parentCategory) => {
    try {
      const response = await SubCategoryContext.deleteSubcategory(
        subcategoryId,
        parentCategory._id
      );

      if (!response) {
        throw new Error("Lỗi xóa danh mục phụ");
      }

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === parentCategory._id ? response.category : cat
        )
      );

      showSnackbar("Xóa danh mục phụ thành công");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      showSnackbar("Lỗi xóa danh mục phụ", "error");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 6, mb: 6, p: 2, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
          Quản lí danh mục
        </Typography>
      </Box>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <List>
          {categories.length > 0 ? (
            categories.map((category) => (
              <React.Fragment key={category._id.$oid || category._id}>
                <ListItem>
                  <IconButton onClick={() => toggleExpand(category._id)}>
                    {expandedCategories[category._id] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                  <ListItemText primary={category.name} />

                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(category)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog(null, true, category)}
                      sx={{
                        textTransform: "none",
                        mr: 6,
                      }}
                    >
                      Thêm danh mục phụ
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse
                  in={expandedCategories[category._id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {renderSubcategories(category)}
                  </List>
                </Collapse>
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No categories yet. Please add a new category." />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Add/Edit Category Dialog with Fade transition */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#2e7d32",
            color: "white",
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          {isEditing
            ? isSubcategory
              ? "Sửa danh mục phụ"
              : "Sửa danh mục"
            : isSubcategory
            ? "Thêm danh mục phụ mới"
            : "Thêm danh mục mới"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCategory.name}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          {isSubcategory && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={currentCategory.status || "active"}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          )}

          {isSubcategory && (
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              Danh mục chính: {parentCategory?.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          <ErrorOutlineIcon // Thêm icon cảnh báo
            sx={{
              fontSize: 60,
              color: "warning.main",
              mb: 2,
              animation: "pulse 1s infinite", // Hiệu ứng nhấp nháy
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
          <DialogTitle
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              pt: 0,
            }}
          >
            Xác nhận xóa danh mục phụ
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Bạn sắp xóa danh mục phụ:
              <Box
                component="span"
                sx={{
                  color: "error.main",
                  fontWeight: "bold",
                  mx: 1,
                }}
              >
                "{subcategoryToDelete?.name}"
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Thao tác này sẽ xóa vĩnh viễn danh mục phụ và không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
              pb: 3,
              gap: 2,
            }}
          >
            <Button
              onClick={handleCloseDeleteDialog}
              variant="outlined"
              startIcon={<CloseIcon />}
              sx={{
                textTransform: "none",
                px: 4,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={() => {
                handleDeleteSubCategory(
                  subcategoryToDelete._id,
                  parentCategoryToDelete
                );
                handleCloseDeleteDialog();
              }}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                textTransform: "none",
                px: 4,
                borderRadius: "8px",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  backgroundColor: "error.dark",
                },
              }}
            >
              Xác nhận xóa
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoryManagement;
