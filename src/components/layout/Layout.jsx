import { Outlet } from "react-router-dom";
import Header from "../layout/Header"; 

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}
