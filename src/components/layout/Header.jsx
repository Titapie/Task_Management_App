import { useAuth } from "../../context/AuthContext";


export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <div className="p-3 bg-yellow-100">
      <div>loading: {String(loading)}</div>
      <div>user: {user ? user.Email : "null"}</div>
      {user && (
        <button onClick={logout} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">
          Đăng xuất
        </button>
      )}
    </div>
  );
}
