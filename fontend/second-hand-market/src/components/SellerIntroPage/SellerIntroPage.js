import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Fade,
    Grow,
    Chip
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Image, ArrowBack } from '@mui/icons-material';
import RegisterSeller from '../../pages/RegisterSeller/RegisterSeller';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 0.3; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 0.3; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled Components
const FloatingElement = styled(Box)(({ theme, size = 100, color = '#e2e8f0', animation = 'pulse' }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    opacity: 0.2,
    animation: animation === 'pulse' ? `${pulse} 3s ease-in-out infinite` :
        animation === 'bounce' ? `${bounce} 2s ease-in-out infinite` :
            `${float} 4s ease-in-out infinite`,
    pointerEvents: 'none',
}));

const GradientBox = styled(Box)({
    background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
});

const PrimaryGradientBox = styled(Box)({
    background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)',
});

const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)',
    borderRadius: 16,
    padding: '12px 32px',
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 8px 32px rgba(42, 59, 76, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: 'linear-gradient(to right, #1f2937, #2a3b4c, #344960, #3e5871)',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 40px rgba(42, 59, 76, 0.4)',
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.5s',
    },
    '&:hover:before': {
        left: '100%',
    },
}));

const FeatureCard = styled(Card)(({ theme, active }) => ({
    borderRadius: 16,
    padding: theme.spacing(3),
    height: '100%',
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    background: active
        ? 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)'
        : 'rgba(255, 255, 255, 0.8)',
    color: active ? '#fff' : theme.palette.text.primary,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${active ? 'transparent' : 'rgba(255, 255, 255, 0.2)'}`,
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: active
            ? '0 20px 40px rgba(42, 59, 76, 0.4)'
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
    },
}));

const IconBox = styled(Box)({
    background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)',
    borderRadius: 16,
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 8px 32px rgba(42, 59, 76, 0.3)',
});

export default function SellerIntroPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleRegisterAsSeller = () => {
        if (!currentUser) {
            navigate('/eco-market/login');
        } else {
            setShowRegisterForm(true);
        }
    };

    const handleBackToIntro = () => {
        setShowRegisterForm(false);
    };

    // If showing register form, render RegisterSeller component
    if (showRegisterForm) {
        return (
            <Box>
                {/* Back button */}
                <Box sx={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}>
                    <Button
                        onClick={handleBackToIntro}
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        sx={{
                            bgcolor: 'white',
                            borderColor: '#2a3b4c',
                            color: '#2a3b4c',
                            '&:hover': {
                                bgcolor: '#f5f5f5',
                                borderColor: '#344960',
                            }
                        }}
                    >
                        Quay lại
                    </Button>
                </Box>
                <RegisterSeller />
            </Box>
        );
    }

    const features = [
        { icon: '♻️', title: 'Kinh doanh bền vững', desc: 'Góp phần bảo vệ môi trường' },
        { icon: '💰', title: 'Thu nhập ổn định', desc: 'Kiếm tiền từ đồ cũ không dùng' },
        { icon: '🌱', title: 'Cộng đồng xanh', desc: 'Kết nối với người quan tâm môi trường' },
        { icon: '🚀', title: 'Dễ dàng bắt đầu', desc: 'Đăng ký nhanh chỉ trong 5 phút' }
    ];

    const stats = [
        { number: '1000+', label: 'Người bán thành công', color: '#2a3b4c' },
        { number: '50K+', label: 'Sản phẩm đã bán', color: '#344960' },
        { number: '98%', label: 'Hài lòng', color: '#496883' }
    ];

    const benefits = [
        { text: 'Miễn phí đăng ký', color: '#2a3b4c' },
        { text: 'Không cam kết dài hạn', color: '#344960' },
        { text: 'Hỗ trợ 24/7', color: '#496883' }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                py: 4,
            }}
        >
            {/* Floating Background Elements */}
            <FloatingElement
                sx={{ top: 80, left: 40 }}
                size={128}
                color="#e2e8f0"
                animation="pulse"
            />
            <FloatingElement
                sx={{ top: 160, right: 80 }}
                size={96}
                color="#cbd5e1"
                animation="bounce"
            />
            <FloatingElement
                sx={{ bottom: 128, left: '25%' }}
                size={64}
                color="#ddd6fe"
                animation="float"
            />
            <FloatingElement
                sx={{ bottom: 80, right: '33%' }}
                size={80}
                color="#e2e8f0"
                animation="pulse"
            />

            <Container maxWidth="lg">
                <Fade in={isVisible} timeout={1000}>
                    <Paper
                        elevation={24}
                        sx={{
                            borderRadius: 6,
                            p: { xs: 4, md: 8 },
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        {/* Header Section */}
                        <Box textAlign="center" mb={8}>
                            <GradientBox>
                                <img src={'/images/logi.png'} alt="Eco Market" style={{ width: '200px', height: '150px' }} />
                            </GradientBox>

                            <PrimaryGradientBox
                                sx={{
                                    width: 96,
                                    height: 4,
                                    borderRadius: 2,
                                    mx: 'auto',
                                    my: 3,
                                }}
                            />

                            <Typography
                                variant="h5"
                                color="text.secondary"
                                sx={{
                                    maxWidth: 600,
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                    '& .highlight': {
                                        color: '#2a3b4c',
                                        fontWeight: 600,
                                    }
                                }}
                            >
                                Chuyển từ người mua thành{' '}
                                <span className="highlight">người bán thông minh</span> -
                                Khởi nghiệp xanh với đồ cũ có giá trị!
                            </Typography>
                        </Box>

                        {/* Features Grid */}
                        <Grid container spacing={3} mb={8}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} sm={6} lg={3} key={index}>
                                    <Grow in={isVisible} timeout={1000 + index * 200}>
                                        <FeatureCard active={activeFeature === index}>
                                            <CardContent sx={{ textAlign: 'center', p: 0 }}>
                                                <Typography variant="h3" mb={2}>
                                                    {feature.icon}
                                                </Typography>
                                                <Typography variant="h6" fontWeight="bold" mb={1}>
                                                    {feature.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        opacity: activeFeature === index ? 0.9 : 0.7
                                                    }}
                                                >
                                                    {feature.desc}
                                                </Typography>
                                            </CardContent>
                                        </FeatureCard>
                                    </Grow>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Stats Section */}
                        <Grid container spacing={4} mb={8}>
                            {stats.map((stat, index) => (
                                <Grid item xs={4} key={index}>
                                    <Box textAlign="center">
                                        <Typography
                                            variant="h3"
                                            fontWeight="bold"
                                            sx={{ color: stat.color, mb: 1 }}
                                        >
                                            {stat.number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        {/* CTA Section */}
                        <Box textAlign="center">
                            <Paper
                                sx={{
                                    p: 4,
                                    mb: 6,
                                    borderRadius: 4,
                                    background: 'linear-gradient(to right, rgba(42, 59, 76, 0.1), rgba(52, 73, 96, 0.1), rgba(62, 88, 113, 0.1), rgba(73, 104, 131, 0.1))',
                                    border: '1px solid rgba(42, 59, 76, 0.1)',
                                }}
                            >
                                <Typography variant="h5" fontWeight="semibold" color="text.primary" mb={2}>
                                    Sẵn sàng biến đồ cũ thành thu nhập?
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Tham gia cộng đồng kinh doanh bền vững và tạo ra tác động tích cực cho môi trường
                                </Typography>
                            </Paper>

                            <StyledButton
                                variant="contained"
                                size="large"
                                onClick={handleRegisterAsSeller}
                                startIcon={<span>🚀</span>}
                                endIcon={<span>→</span>}
                                sx={{ mb: 4 }}
                            >
                                Đăng ký làm người bán ngay
                            </StyledButton>

                            <Box
                                display="flex"
                                justifyContent="center"
                                gap={4}
                                flexWrap="wrap"
                            >
                                {benefits.map((benefit, index) => (
                                    <Chip
                                        key={index}
                                        icon={<span style={{ color: benefit.color }}>✓</span>}
                                        label={benefit.text}
                                        variant="outlined"
                                        sx={{
                                            borderColor: benefit.color,
                                            color: 'text.secondary',
                                            fontSize: '0.875rem',
                                            '& .MuiChip-icon': {
                                                color: benefit.color,
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
}