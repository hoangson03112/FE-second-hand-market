import React, { useEffect, useState } from "react";
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
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import CategoryContext from "../../contexts/CategoryContext";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    _id: null,
    name: "",
    slug: "",
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

  // Show notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Close notification
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
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
        _id: null,
        name: "",
        slug: "",
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

    // Auto-generate slug when name changes
    if (name === "name") {
      updatedCategory.slug = generateSlug(value);
    }

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
        updateCategory(currentCategory);
        showSnackbar("Category updated successfully");
      }
    } else {
      if (isSubcategory) {
        addSubcategory(currentCategory, parentCategory._id);
        showSnackbar("New subcategory added successfully");
      } else {
        // Add new main category
        await addCategory();

        showSnackbar("New category added successfully");
      }
    }

    handleCloseDialog();
  };

  // Delete category
  const handleDeleteCategory = (
    categoryId,
    isSubcat = false,
    parent = null
  ) => {
    if (isSubcat) {
      // Delete subcategory
      const updatedCategories = categories.map((cat) => {
        if (cat._id === parent._id) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(
              (subcat) => subcat._id !== categoryId
            ),
          };
        }
        return cat;
      });

      setCategories(updatedCategories);
      showSnackbar("Subcategory deleted successfully");
    } else {
      // Delete main category
      const categoryToDelete = categories.find((cat) => cat._id === categoryId);

      if (
        categoryToDelete &&
        categoryToDelete.subcategories &&
        categoryToDelete.subcategories.length > 0
      ) {
        showSnackbar("Cannot delete category with subcategories", "error");
        return;
      }

      const updatedCategories = categories.filter(
        (cat) => cat._id !== categoryId
      );
      setCategories(updatedCategories);
      showSnackbar("Category deleted successfully");
    }
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
            onClick={() => handleDeleteCategory(subcat._id, true, category)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await CategoryContext.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showSnackbar("Failed to load categories", "error");
      }
    };

    fetchCategories();
  }, []);

  // Add a new category
  const addCategory = async (category) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      showSnackbar("New category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      showSnackbar("Failed to add category", "error");
    }
  };

  // Update an existing category
  const updateCategory = async (category) => {
    try {
      const response = await fetch(`/api/categories/${category._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const updatedCategory = await response.json();
      const updatedCategories = categories.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      );
      setCategories(updatedCategories);
      showSnackbar("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      showSnackbar("Failed to update category", "error");
    }
  };

  // Add a new subcategory
  const addSubcategory = async (subcategory, parentCategoryId) => {
    try {
      const response = await fetch(
        `/api/categories/${parentCategoryId}/subcategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subcategory),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add subcategory");
      }

      const newSubcategory = await response.json();
      const updatedCategories = categories.map((cat) => {
        if (cat._id === parentCategoryId) {
          return {
            ...cat,
            subcategories: [...(cat.subcategories || []), newSubcategory],
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      showSnackbar("New subcategory added successfully");
    } catch (error) {
      console.error("Error adding subcategory:", error);
      showSnackbar("Failed to add subcategory", "error");
    }
  };

  // Update an existing subcategory
  const updateSubcategory = async (subcategory, parentCategoryId) => {
    try {
      const response = await fetch(
        `/api/categories/${parentCategoryId}/subcategories/${subcategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subcategory),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subcategory");
      }

      const updatedSubcategory = await response.json();
      const updatedCategories = categories.map((cat) => {
        if (cat._id === parentCategoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((subcat) =>
              subcat._id === updatedSubcategory._id
                ? updatedSubcategory
                : subcat
            ),
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      showSnackbar("Subcategory updated successfully");
    } catch (error) {
      console.error("Error updating subcategory:", error);
      showSnackbar("Failed to update subcategory", "error");
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
