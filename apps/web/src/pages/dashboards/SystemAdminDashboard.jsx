import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const StatCard = ({ label, value, color }) => (
    <div className={`rounded-xl p-5 text-white ${color} shadow-md`}>
        <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
);

const ActionCard = ({ icon, title, description, to, accent }) => (
    <Link
        to={to}
        className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5 flex gap-4 items-start"
    >
        <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        </div>
    </Link>
);

export default function SystemAdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-500 px-8 py-10 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            System Admin
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
                    <p className="text-red-100 mt-1 text-sm">
                        Full platform oversight — users, orgs, roles, and settings.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Users" value="—" color="bg-red-500" />
                    <StatCard label="Universities" value="—" color="bg-rose-500" />
                    <StatCard label="Organizations" value="—" color="bg-pink-500" />
                    <StatCard label="Active Sessions" value="—" color="bg-fuchsia-600" />
                </div>

                {/* Action cards */}
                <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ActionCard
                        to="#"
                        accent="bg-red-100"
                        title="Manage Users"
                        description="View, edit, activate or deactivate all platform users."
                        icon={<svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-rose-100"
                        title="Assign Roles"
                        description="Assign University Admins, Recruiters, and Module Managers."
                        icon={<svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-pink-100"
                        title="System Audit Logs"
                        description="Review all security events, login history, and changes."
                        icon={<svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-fuchsia-100"
                        title="Platform Settings"
                        description="Configure global settings, email templates, API keys."
                        icon={<svg className="w-5 h-5 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-orange-100"
                        title="Organizations"
                        description="View all registered organizations and their status."
                        icon={<svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-amber-100"
                        title="Email Templates"
                        description="Edit verification, welcome, and notification emails."
                        icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    />
                </div>
            </div>
        </div>
    );
}
