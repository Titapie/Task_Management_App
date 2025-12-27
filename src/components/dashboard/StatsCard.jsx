// components/stats/StatsCard.jsx
import React from 'react';

const StatsCard = ({
                       title,
                       value,
                       icon,
                       color = 'blue',
                       change,
                       subtitle,
                       isLoading = false,
                       className = '' // ✅ THÊM prop className
                   }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-100'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-100'
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-100'
        },
        yellow: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
            border: 'border-yellow-100'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-100'
        },
        gray: {
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            border: 'border-gray-100'
        }
    };

    if (isLoading) {
        return (
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse ${className}`}>
                <div className="flex justify-between items-start mb-5">
                    <div className="h-4 bg-gray-200 rounded-md w-24"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-9 bg-gray-200 rounded-md w-20 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-md w-32"></div>
            </div>
        );
    }

    const colors = colorClasses[color];

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300 group ${className}`}>
            <div className="flex justify-between items-start mb-5">
                <h3 className="text-sm font-medium text-gray-600 leading-snug">{title}</h3>
                {icon && (
                    <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                        {React.cloneElement(icon, {
                            className: `w-5 h-5 ${colors.text}`,
                            size: 20
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-3 mb-2">
                <p className="text-3xl font-bold text-gray-800 tracking-tight">{value}</p>
                {change !== undefined && change !== null && (
                    <span className={`text-sm font-semibold flex items-center gap-0.5 px-2 py-1 rounded-md ${
                        change > 0
                            ? 'text-green-600 bg-green-50'
                            : change < 0
                                ? 'text-red-600 bg-red-50'
                                : 'text-gray-500 bg-gray-50'
                    }`}>
                        <span className="text-base">
                            {change > 0 ? '↗' : change < 0 ? '↘' : '→'}
                        </span>
                        {Math.abs(change)}%
                    </span>
                )}
            </div>

            {subtitle && (
                <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
            )}
        </div>
    );
};

export default StatsCard;