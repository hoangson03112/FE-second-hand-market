import { useState } from "react";

/**
 * Hook để sử dụng localStorage dễ dàng hơn
 * @param {string} key Khóa để lưu trong localStorage
 * @param {any} initialValue Giá trị khởi tạo nếu không có dữ liệu
 * @returns {Array} [storedValue, setValue] - Giá trị hiện tại và hàm để cập nhật giá trị
 */
function useLocalStorage(key, initialValue) {
  // Tạo state lấy giá trị từ localStorage (nếu có) hoặc initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Kiểm tra xem có dữ liệu trong localStorage chưa
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Lỗi khi đọc từ localStorage với key "${key}":`, error);
      return initialValue;
    }
  });

  // Hàm để cập nhật giá trị trong state và localStorage
  const setValue = (value) => {
    try {
      // Cho phép value là một hàm (như setter của useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Lưu state
      setStoredValue(valueToStore);

      // Lưu vào localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Lỗi khi lưu vào localStorage với key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
