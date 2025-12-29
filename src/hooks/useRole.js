import { useAuth } from "./useAuth";

export const useRole = () => {
  const { user } = useAuth();

  // 1. Lấy role và chuẩn hóa về chữ thường (lowercase) để so sánh
  // Hỗ trợ cả trường hợp backend trả về 'Role' hoặc 'role'
  const role = String(user?.Role ?? user?.role ?? "").toLowerCase();

  // 2. Xác định quyền Admin
  const isAdmin = role === "admin";

  // 3. Xác định các quyền hạn khác (Tùy chỉnh theo nghiệp vụ)
  // Ví dụ: Admin có toàn quyền sửa/xóa
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  return {
    role, // Trả về role chuỗi để kiểm tra cụ thể nếu cần
    isAdmin, // Boolean: Có phải admin không
    canEdit, // Boolean: Có quyền sửa không
    canDelete, // Boolean: Có quyền xóa không
  };
};
