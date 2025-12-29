import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AdminProjectsPage() {
  const { user } = useAuth();

  if (user?.Role !== "admin") {
    return <div>Bạn không có quyền truy cập</div>;
  }

  return (
    <div>
      <h1>Admin Projects</h1>
    </div>
  );
}
