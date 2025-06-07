/**
 * Các hàm kiểm tra dữ liệu form
 */

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // Mật khẩu tối thiểu 8 ký tự, bao gồm chữ và số
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

export const validatePhone = (phone) => {
  // Kiểm tra số điện thoại Việt Nam
  const re = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
  return re.test(phone);
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validatePrice = (price) => {
  // Giá phải là số dương
  return !isNaN(price) && parseFloat(price) > 0;
};

export const validateImage = (file) => {
  // Kiểm tra xem file có phải là hình ảnh không
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return file && validTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  // Kiểm tra kích thước file, mặc định tối đa 5MB
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file && file.size <= maxSizeBytes;
};

export const getFormValidationErrors = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  });
  
  return errors;
}; 