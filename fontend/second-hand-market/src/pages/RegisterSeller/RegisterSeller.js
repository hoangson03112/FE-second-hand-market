import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Alert,
    Divider,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Fade,
    Zoom,
    Slide
} from '@mui/material';
import {
    Person,
    Store,
    Payment,
    CheckCircle,
    Phone,
    ExpandMore,
    PhotoCamera,
    Upload,
    Verified,
    LocalOffer,
    Security,
    TrendingUp,
    Badge
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import PhoneVerification from './../../components/PhoneVerification/PhoneVerification';
import { useAuth } from '../../contexts/AuthContext';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(63, 81, 181, 0); }
  100% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0); }
`;

// Styled Components with WOW factor
const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 32px 64px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #667eea 50%, #f093fb 75%, #667eea 100%)',
        backgroundSize: '400% 100%',
        animation: `${shimmer} 3s ease-in-out infinite`,
    }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)',
    color: 'white',
    padding: theme.spacing(6),
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        animation: `${shimmer} 4s ease-in-out infinite`,
        transform: 'rotate(45deg)',
    }
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',

}));

const UploadBox = styled(Box)(({ theme }) => ({
    border: '2px dashed #b0c5d9',
    borderRadius: 16,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        transition: 'left 0.5s',
    },
    '&:hover': {
        borderColor: '#344960',
        background: 'linear-gradient(135deg, #e8f2ff 0%, #dbe7fd 100%)',
        transform: 'scale(1.02)',
        '&::before': {
            left: '100%',
        }
    }
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
    animation: `${float} 3s ease-in-out infinite`,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    border: '3px solid white',
}));

const PulseButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px 32px',
    fontSize: '1.1rem',
    background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871)',
    '&:hover': {
        background: 'linear-gradient(to right, #344960, #3e5871, #496883)',
        animation: `${pulse} 1.5s infinite`,
    }
}));

const GradientProgress = styled(LinearProgress)(({ theme }) => ({
    height: 8,
    borderRadius: 4,
    background: 'rgba(255,255,255,0.2)',
    '& .MuiLinearProgress-bar': {
        background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)',
        borderRadius: 4,
    }
}));

const steps = [
    { label: 'Xác minh số điện thoại', icon: <Phone />, color: '#2a3b4c' },
    { label: 'Thông tin cá nhân', icon: <Person />, color: '#344960' },
    { label: 'Thông tin thanh toán', icon: <Payment />, color: '#3e5871' },
    { label: 'Xác nhận', icon: <CheckCircle />, color: '#496883' }
];

export default function RegisterSeller() {
    const [activeStep, setActiveStep] = useState(1);
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        avatar: null,
        phone: '',
        address: '',
        city: '',
        district: '',
        idCardFront: null,
        idCardBack: null,
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        agreeTerms: false,
        agreePolicy: false
    });
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
    const banks = ['Vietcombank', 'Techcombank', 'BIDV', 'VietinBank', 'Agribank', 'MB Bank'];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => setActiveStep(prev => prev + 1);
    const handleBack = () => setActiveStep(prev => prev - 1);

    const handleSubmit = () => {
        console.log('Form data:', formData);
        alert('Đăng ký thành công! Chúng tôi sẽ xem xét và phản hồi trong 24h.');
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Fade in timeout={600}>
                        <StyledCard elevation={0}>
                            <Box sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" mb={3}>
                                    <FloatingAvatar sx={{ bgcolor: steps[0].color, mr: 2, width: 48, height: 48 }}>
                                        <Phone />
                                    </FloatingAvatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                                            Xác minh số điện thoại
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Bảo mật tài khoản với xác thực 2 lớp
                                        </Typography>
                                    </Box>
                                    <Box sx={{ ml: 'auto' }}>
                                        <Security sx={{ color: 'success.main', fontSize: 32 }} />
                                    </Box>
                                </Box>

                                <PhoneVerification
                                    phone={currentUser?.phoneNumber}
                                    onVerified={() => {
                                        setIsPhoneVerified(true)
                                        handleNext()
                                    }}
                                />

                                {isPhoneVerified && (
                                    <Zoom in timeout={500}>
                                        <Alert
                                            severity="success"
                                            sx={{
                                                mt: 3,
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                                                border: '1px solid rgba(76, 175, 80, 0.2)'
                                            }}
                                            icon={<Verified />}
                                        >
                                            <Typography variant="body1" fontWeight="medium">
                                                🎉 Số điện thoại đã được xác minh thành công!
                                            </Typography>
                                        </Alert>
                                    </Zoom>
                                )}
                            </Box>
                        </StyledCard>
                    </Fade>
                );

            case 1:
                return (
                    <Slide direction="left" in timeout={600}>
                        <StyledCard elevation={0}>
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" mb={4}>
                                    <FloatingAvatar sx={{ bgcolor: steps[1].color, mr: 2, width: 48, height: 48 }}>
                                        <Person />
                                    </FloatingAvatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                                            Thông tin cá nhân
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Xây dựng hồ sơ của bạn
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={3}>
                                    {/* Avatar Upload */}
                                    <Grid item xs={12}>
                                        <Box textAlign="center" mb={3}>
                                            <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                                📸 Ảnh đại diện
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mb={3}>
                                                Tải lên ảnh đại diện để khách hàng dễ nhận biết
                                            </Typography>
                                        </Box>

                                        <UploadBox sx={{ maxWidth: 400, mx: 'auto' }}>
                                            <FloatingAvatar sx={{
                                                width: 120,
                                                height: 120,
                                                mx: 'auto',
                                                mb: 2,
                                                background: 'linear-gradient(to right, #2a3b4c, #344960)',
                                                fontSize: '3rem'
                                            }}>
                                                {formData.avatar ? (
                                                    <img
                                                        src={URL.createObjectURL(formData.avatar)}
                                                        alt="Avatar"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            borderRadius: '50%'
                                                        }}
                                                    />
                                                ) : (
                                                    <PhotoCamera fontSize="large" />
                                                )}
                                            </FloatingAvatar>
                                            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                                {formData.avatar ? 'Thay đổi ảnh đại diện' : 'Tải lên ảnh đại diện'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                JPG, PNG. Tối đa 5MB
                                            </Typography>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleInputChange('avatar', e.target.files[0])}
                                            />
                                            {formData.avatar && (
                                                <Typography variant="body2" color="success.main" mt={1}>
                                                    ✅ {formData.avatar.name}
                                                </Typography>
                                            )}
                                        </UploadBox>
                                    </Grid>

                                    {/* Địa chỉ */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Địa chỉ"
                                            required
                                            multiline
                                            rows={2}
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Số nhà, tên đường, phường/xã..."
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    '&:hover fieldset': {
                                                        borderColor: '#344960',
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Thành phố</InputLabel>
                                            <Select
                                                value={formData.city}
                                                label="Thành phố"
                                                isSearchable

                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                sx={{ borderRadius: 3 }}
                                            >
                                                {cities.map(city => (
                                                    <MenuItem key={city} value={city}>{city}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Quận/Huyện"
                                            required
                                            value={formData.district}
                                            onChange={(e) => handleInputChange('district', e.target.value)}
                                            placeholder="Quận/Huyện"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    '&:hover fieldset': {
                                                        borderColor: '#344960',
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    {/* Ảnh CMND/CCCD */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                            📄 Ảnh CMND/CCCD
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            Vui lòng tải lên ảnh mặt trước và mặt sau CMND/CCCD rõ nét
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <UploadBox>
                                            <FloatingAvatar sx={{
                                                width: 80,
                                                height: 80,
                                                mx: 'auto',
                                                mb: 2,
                                                background: 'linear-gradient(to right, #2a3b4c, #344960)'
                                            }}>
                                                <Badge fontSize="large" />
                                            </FloatingAvatar>
                                            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                                Mặt trước CMND/CCCD
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                JPG, PNG. Tối đa 5MB
                                            </Typography>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleInputChange('idCardFront', e.target.files[0])}
                                            />
                                            {formData.idCardFront && (
                                                <Typography variant="body2" color="success.main" mt={1}>
                                                    ✅ {formData.idCardFront.name}
                                                </Typography>
                                            )}
                                        </UploadBox>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <UploadBox>
                                            <FloatingAvatar sx={{
                                                width: 80,
                                                height: 80,
                                                mx: 'auto',
                                                mb: 2,
                                                background: 'linear-gradient(to right, #344960, #3e5871)'
                                            }}>
                                                <Badge fontSize="large" />
                                            </FloatingAvatar>
                                            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                                Mặt sau CMND/CCCD
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                JPG, PNG. Tối đa 5MB
                                            </Typography>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleInputChange('idCardBack', e.target.files[0])}
                                            />
                                            {formData.idCardBack && (
                                                <Typography variant="body2" color="success.main" mt={1}>
                                                    ✅ {formData.idCardBack.name}
                                                </Typography>
                                            )}
                                        </UploadBox>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </StyledCard>
                    </Slide>
                );

            case 2:
                return (
                    <Slide direction="left" in timeout={600}>
                        <StyledCard elevation={0}>
                            <CardContent sx={{ p: 4 }}>
                                <Box display="flex" alignItems="center" mb={4}>
                                    <FloatingAvatar sx={{ bgcolor: steps[3].color, mr: 2, width: 48, height: 48 }}>
                                        <Payment />
                                    </FloatingAvatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                                            Thông tin thanh toán
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Nhận tiền từ việc bán hàng
                                        </Typography>
                                    </Box>
                                </Box>

                                <Alert
                                    severity="info"
                                    sx={{
                                        mb: 4,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)',
                                        border: '1px solid rgba(33, 150, 243, 0.2)'
                                    }}
                                >
                                    <Typography variant="body1">
                                        💰 Thông tin tài khoản ngân hàng để nhận thanh toán từ việc bán hàng
                                    </Typography>
                                </Alert>

                                <Box textAlign="center" mb={4}>
                                    <FloatingAvatar sx={{
                                        width: 100,
                                        height: 100,
                                        mx: 'auto',
                                        mb: 2,
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                    }}>
                                        <Payment fontSize="large" />
                                    </FloatingAvatar>
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                        Thông tin thanh toán
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Bảo mật và an toàn 100%
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Ngân hàng</InputLabel>
                                            <Select
                                                value={formData.bankName}
                                                label="Ngân hàng"
                                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                                sx={{ borderRadius: 3 }}
                                            >
                                                {banks.map(bank => (
                                                    <MenuItem key={bank} value={bank}>{bank}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Số tài khoản"
                                            required
                                            value={formData.accountNumber}
                                            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                            placeholder="1234567890"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    '&:hover fieldset': {
                                                        borderColor: '#4facfe',
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Chủ tài khoản"
                                            required
                                            value={formData.accountHolder}
                                            onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                                            placeholder="Tên chủ tài khoản"
                                            helperText="📋 Tên chủ tài khoản phải trùng với tên đăng ký"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    '&:hover fieldset': {
                                                        borderColor: '#4facfe',
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </StyledCard>
                    </Slide>
                );

            case 3:
                return (
                    <Zoom in timeout={800}>
                        <StyledCard elevation={0}>
                            <CardContent sx={{ p: 4 }}>
                                <Box textAlign="center" mb={4}>
                                    <FloatingAvatar sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 3,
                                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                                    }}>
                                        <CheckCircle sx={{ fontSize: 60 }} />
                                    </FloatingAvatar>
                                    <Typography variant="h3" fontWeight="bold" sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2
                                    }}>
                                        Xác nhận thông tin
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        Kiểm tra lại thông tin trước khi hoàn tất đăng ký
                                    </Typography>
                                </Box>

                                {/* Enhanced Accordions */}
                                <Accordion
                                    defaultExpanded
                                    sx={{
                                        mb: 2,
                                        borderRadius: '16px !important',
                                        '&:before': { display: 'none' },
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        sx={{
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)'
                                        }}
                                    >
                                        <Person sx={{ mr: 2, color: steps[1].color }} />
                                        <Typography variant="h6" fontWeight="bold">Thông tin cá nhân</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Box textAlign="center">
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>Ảnh đại diện:</Typography>
                                                    {formData.avatar ? (
                                                        <Avatar
                                                            src={URL.createObjectURL(formData.avatar)}
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                mx: 'auto',
                                                                border: '3px solid #344960'
                                                            }}
                                                        />
                                                    ) : (
                                                        <Avatar sx={{
                                                            width: 80,
                                                            height: 80,
                                                            mx: 'auto',
                                                            background: 'linear-gradient(to right, #2a3b4c, #344960)'
                                                        }}>
                                                            <PhotoCamera />
                                                        </Avatar>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>Địa chỉ:</Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formData.address}, {formData.district}, {formData.city}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom mt={2}>CMND/CCCD:</Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formData.idCardFront && formData.idCardBack ? '✅ Đã tải lên đầy đủ' : '⚠️ Chưa đầy đủ'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>



                                <Accordion sx={{
                                    mb: 3,
                                    borderRadius: '16px !important',
                                    '&:before': { display: 'none' },
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        sx={{
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                                        }}
                                    >
                                        <Payment sx={{ mr: 2, color: steps[2].color }} />
                                        <Typography variant="h6" fontWeight="bold">Thông tin thanh toán</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>Ngân hàng:</Typography>
                                                <Typography variant="body1" fontWeight="medium">{formData.bankName}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>Số TK:</Typography>
                                                <Typography variant="body1" fontWeight="medium">{formData.accountNumber}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>Chủ TK:</Typography>
                                                <Typography variant="body1" fontWeight="medium">{formData.accountHolder}</Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>

                                <Divider sx={{ my: 4 }} />

                                {/* Enhanced Terms */}
                                <Box sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)',
                                    border: '1px solid rgba(102, 126, 234, 0.1)'
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.agreeTerms}
                                                onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                                                sx={{
                                                    color: '#667eea',
                                                    '&.Mui-checked': { color: '#667eea' }
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body1" fontWeight="medium">
                                                ✅ Tôi đồng ý với các điều khoản sử dụng
                                            </Typography>
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.agreePolicy}
                                                onChange={(e) => handleInputChange('agreePolicy', e.target.checked)}
                                                sx={{
                                                    color: '#667eea',
                                                    '&.Mui-checked': { color: '#667eea' }
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography variant="body1" fontWeight="medium">
                                                🔒 Tôi đồng ý với chính sách bảo mật
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Zoom>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)',
            py: 4,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <StyledPaper>
                    {/* Enhanced Header */}
                    <HeaderBox>
                        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{ position: 'relative', zIndex: 2 }}>
                            🚀 Đăng ký người bán
                        </Typography>
                        <Typography variant="h5" sx={{ opacity: 0.95, position: 'relative', zIndex: 2 }}>
                            Tham gia cộng đồng mua bán đồ cũ và bắt đầu kinh doanh ngay hôm nay
                        </Typography>
                        <Box sx={{ mt: 3, position: 'relative', zIndex: 2 }}>
                            <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
                            <Typography variant="body1" component="span">
                                Miễn phí 100% - Không phí ẩn
                            </Typography>
                        </Box>
                    </HeaderBox>

                    {/* Enhanced Progress */}
                    <Box sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight="bold">
                                Bước {activeStep + 1}/{steps.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {Math.round(((activeStep + 1) / steps.length) * 100)}% hoàn thành
                            </Typography>
                        </Box>
                        <GradientProgress
                            variant="determinate"
                            value={((activeStep + 1) / steps.length) * 100}
                        />
                    </Box>

                    {/* Enhanced Stepper */}
                    <Box sx={{ p: 3 }}>
                        <Stepper activeStep={activeStep} orientation="horizontal" alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={step.label} completed={index < activeStep}>
                                    <StepLabel
                                        icon={
                                            <Avatar sx={{
                                                width: 40,
                                                height: 40,
                                                bgcolor: index <= activeStep ? step.color : 'grey.300',
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                transform: index === activeStep ? 'scale(1.1)' : 'scale(1)',
                                                boxShadow: index === activeStep ? `0 0 20px ${step.color}40` : 'none'
                                            }}>
                                                {index < activeStep ? <CheckCircle /> : step.icon}
                                            </Avatar>
                                        }
                                    >
                                        <Typography
                                            variant="body2"
                                            fontWeight={index <= activeStep ? "bold" : "medium"}
                                            color={index <= activeStep ? "text.primary" : "text.secondary"}
                                        >
                                            {step.label}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 4 }}>
                        {renderStepContent(activeStep)}
                    </Box>

                    {/* Enhanced Navigation */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 4,
                        background: 'linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%)',
                        borderTop: '1px solid rgba(0,0,0,0.05)'
                    }}>

                        <Button
                            onClick={handleBack}
                            disabled={activeStep === 0 || activeStep === 1}
                            variant="outlined"
                            size="large"
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                borderColor: '#667eea',
                                color: '#667eea',
                                '&:hover': {
                                    borderColor: '#5a6fd8',
                                    backgroundColor: 'rgba(102, 126, 234, 0.04)'
                                }
                            }}
                        >
                            ← Quay lại
                        </Button>

                        {activeStep === steps.length - 1 ? (
                            <PulseButton
                                onClick={handleSubmit}
                                disabled={!formData.agreeTerms || !formData.agreePolicy}
                                variant="contained"
                                size="large"
                                sx={{ px: 4 }}
                            >
                                🎉 Hoàn tất đăng ký
                            </PulseButton>
                        ) : (
                            <PulseButton
                                onClick={handleNext}
                                disabled={activeStep === 0 && !isPhoneVerified}
                                variant="contained"
                                size="large"
                                sx={{ px: 4 }}
                            >
                                Tiếp tục →
                            </PulseButton>
                        )}
                    </Box>
                </StyledPaper>
            </Container>
        </Box>
    );
}