import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/quick-login';
    };

    const navigation = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: Users
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 z-30 ${
                sidebarOpen ? 'w-64' : 'w-20'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Logo & Toggle */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        {sidebarOpen ? (
                            <>
                                <div>
                                    <h1 className="text-2xl font-bold text-purple-600">Admin Page</h1>
                                    <p className="text-sm text-gray-600 mt-1">Quản trị web</p>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-purple-100 rounded-lg transition-colors mx-auto"
                            >
                                <Menu className="w-5 h-5 text-purple-600" />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                                                isActive
                                                    ? 'bg-purple-50 text-purple-500 border-r-4 border-purple-500'
                                                    : 'text-gray-700 hover:bg-purple-100 hover:text-purple-500'
                                            }`}
                                            title={!sidebarOpen ? item.name : ''}
                                        >
                                            <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                                            {sidebarOpen && (
                                                <span className="font-medium">{item.name}</span>
                                            )}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                                !sidebarOpen && 'justify-center'
                            }`}
                            title={!sidebarOpen ? 'Đăng xuất' : ''}
                        >
                            <LogOut className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`flex-1 transition-all duration-300 ${
                sidebarOpen ? 'ml-64' : 'ml-20'
            }`}>
                <main className="h-screen w-full ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;