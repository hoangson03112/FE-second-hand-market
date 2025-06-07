
import React, { useState } from "react";
import {
    TextField,
    InputAdornment,
    IconButton,
    Box,
    useTheme, // To access theme for consistent spacing if needed
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles"; // Import styled

// Styled component for the main search container
const SearchContainer = styled(Box)(({ theme }) => ({
    width: "100%", // Take full width of parent
    maxWidth: "400px", // Example max width, adjust as needed
    [theme.breakpoints.up("sm")]: {
        width: "auto", // Adjust width for larger screens if desired
    },
    // Add any general container styling if needed, e.g., margin
    margin: theme.spacing(2, 0), // Example: 2 units top/bottom, 0 left/right
}));

// Styled component for the TextField wrapper to apply common styles
const StyledSearchTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "30px", // More rounded for a pill-like shape
        backgroundColor: theme.palette.common.white, // White background for the input
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Subtle, modern shadow
        transition: "box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out",
        border: "1px solid rgba(230, 230, 230, 0.7)", // Light border

        "&:hover": {
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)", // Slightly more pronounced shadow on hover
            borderColor: "rgba(50, 65, 85, 0.2)", // Subtle border change on hover
            backgroundColor: "rgba(255, 255, 255, 0.95)", // Slight background change on hover
        },
        "&.Mui-focused": {
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)", // Stronger shadow on focus
            borderColor: "rgba(50, 65, 85, 0.4)", // More visible border on focus
            backgroundColor: theme.palette.common.white, // Keep white on focus
        },
        "& fieldset": {
            border: "none", // Remove the default TextField border outline
        },
    },
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.5, 2), // Adjust padding for a comfortable text input area
        fontSize: "0.95rem", // Slightly larger font size
        color: "#324155", // Dark text color
        "&::placeholder": {
            // Styling for placeholder text
            color: "#8898a8", // Lighter gray for placeholder
            opacity: 1, // Ensure placeholder is not too transparent
            fontWeight: 400,
        },
    },
}));

// Styled component for the search/clear icons within InputAdornment
const StyledAdornmentButton = styled(IconButton)(({ theme }) => ({
    color: "#607d8b", // Default icon color
    transition: "color 0.2s ease-in-out, transform 0.2s ease-in-out",
    "&:hover": {
        color: "#324155", // Darker color on hover
        transform: "scale(1.1)", // Subtle grow effect on hover
        backgroundColor: "transparent", // Keep background transparent
    },
}));

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const theme = useTheme(); // Access the theme

    const handleSearchSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        if (onSearch) {
            onSearch(searchQuery);
        }
        // Optionally clear search query after submit: setSearchQuery("");
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        // Optionally trigger a search with empty query if needed
        // if (onSearch) {
        //   onSearch("");
        // }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchSubmit(event);
        }
    };

    return (
        <SearchContainer>
            <form onSubmit={handleSearchSubmit}>
                <StyledSearchTextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ ml: theme.spacing(1) }}>
                                {" "}
                                {/* Left padding */}
                                <SearchIcon sx={{ color: "#607d8b" }} />{" "}
                                {/* Fixed search icon color */}
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end" sx={{ mr: theme.spacing(0.5) }}>
                                {/* Nút X luôn chiếm chỗ, chỉ ẩn/hiện bằng visibility/opacity */}
                                <StyledAdornmentButton
                                    aria-label="clear search"
                                    onClick={handleClearSearch}
                                    edge="end"
                                    size="small"
                                    style={{
                                        visibility: searchQuery ? "visible" : "hidden",
                                        opacity: searchQuery ? 1 : 0,
                                        pointerEvents: searchQuery ? "auto" : "none",
                                        transition: "opacity 0.2s",
                                    }}
                                >
                                    <ClearIcon />
                                </StyledAdornmentButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
        </SearchContainer>
    );
};

export default SearchBar;
