import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Skeleton,
  styled,
} from '@mui/material';
import { Explore } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3, 2),
  cursor: 'pointer',
  textDecoration: 'none',
  color: 'inherit',
  border: '2px solid transparent',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    transform: 'translateY(-4px)',
    '& .category-avatar': {
      transform: 'scale(1.1)',
      boxShadow: theme.shadows[4],
    },
    '& .explore-icon': {
      opacity: 1,
    },
  },
}));

const CategoryAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: theme.spacing(2),
  border: `3px solid ${theme.palette.grey[100]}`,
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
}));

const ExploreIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(251, 146, 60, 0.9)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  color: 'white',
}));

const CategoryName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
  transition: 'color 0.3s ease-in-out',
}));

import { CategoryCardProps } from '../types/Common.types';

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isLoading = false }) => {
  const getImageSrc = () => {
    const imageUrl = category?.image;
    if (!imageUrl) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIgZmlsbD0iI2Y5ZmFmYiIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5OmPC90ZXh0Pgo8L3N2Zz4=';
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return ` ${imageUrl}`;
  };

  if (isLoading) {
    return (
      <StyledCard>
        <Skeleton variant="circular" width={80} height={80} />
        <Skeleton variant="text" width={100} height={24} sx={{ mt: 2 }} />
      </StyledCard>
    );
  }

  return (
    <Link to={`/eco-market?categoryID=${category._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <StyledCard>
        <Box position="relative">
        <CategoryAvatar
          className="category-avatar"
          src={getImageSrc()}
          alt={category.name}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.target as HTMLImageElement;
            console.log('Category image load error for:', target.src);
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIgZmlsbD0iI2Y5ZmFmYiIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5OmPC90ZXh0Pgo8L3N2Zz4=';
          }}
        />
        <ExploreIcon className="explore-icon">
          <Explore fontSize="small" />
        </ExploreIcon>
      </Box>
      
        <CategoryName variant="body2">
          {category.name}
        </CategoryName>
      </StyledCard>
    </Link>
  );
};

export default CategoryCard; 