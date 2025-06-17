import axios from 'axios';
import React from 'react'
class SellerContext {
    async registerSeller(sellerInfo) {
        const token = localStorage.getItem('token');
        try {
            // Tạo FormData để gửi file cùng với dữ liệu
            const formData = new FormData();
            
            // Thêm tất cả field text
            formData.append('address', sellerInfo.address || '');
            formData.append('province', sellerInfo.province || '');
            formData.append('district', sellerInfo.district || '');
            formData.append('ward', sellerInfo.ward || '');
            formData.append('bankName', sellerInfo.bankName || '');
            formData.append('accountNumber', sellerInfo.accountNumber || '');
            formData.append('accountHolder', sellerInfo.accountHolder || '');
            formData.append('agreeTerms', sellerInfo.agreeTerms || false);
            formData.append('agreePolicy', sellerInfo.agreePolicy || false);
            
            // Thêm các file ảnh
            if (sellerInfo.avatar) {
                formData.append('avatar', sellerInfo.avatar);
            }
            if (sellerInfo.idCardFront) {
                formData.append('idCardFront', sellerInfo.idCardFront);
            }
            if (sellerInfo.idCardBack) {
                formData.append('idCardBack', sellerInfo.idCardBack);
            }
            
            const response = await axios.post('http://localhost:2000/eco-market/sellers/register', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Quan trọng cho file upload
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error registering seller:', error);
            throw error;
        }
    }
}
export default new SellerContext();
