import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function Profile() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading your profile...</p>
            </div>
        );
    }

    if (!user) return null; // will redirect in useEffect

    const roleLabels = {
        STUDENT: "Student",
        STAFF: "Staff",
        UNIVERSITY_ADMIN: "University Admin",
        SYSTEM_ADMIN: "System Admin",
        ORGANIZATION: "Organization",
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-blue-600 h-24" />
                    <div className="px-6 pb-6">
                        <div className="-mt-12 flex items-end justify-between">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center shadow">
                                <span className="text-3xl font-bold text-blue-600">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-12 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors border border-gray-200 rounded-md px-4 py-2 hover:border-red-300"
                            >
                                Sign out
                            </button>
                        </div>

                        <div className="mt-4">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500">{user.email}</p>
                            <span className="mt-2 inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                {roleLabels[user.globalRole] || user.globalRole}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info cards */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="bg-white shadow rounded-lg p-5">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Details</h3>
                        <dl className="mt-3 space-y-2">
                            <div>
                                <dt className="text-xs text-gray-400">Full Name</dt>
                                <dd className="text-sm font-medium text-gray-900">{user.name}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-400">Email</dt>
                                <dd className="text-sm font-medium text-gray-900">{user.email}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-gray-400">Role</dt>
                                <dd className="text-sm font-medium text-gray-900">{roleLabels[user.globalRole] || user.globalRole}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-white shadow rounded-lg p-5">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Activity</h3>
                        <p className="mt-3 text-sm text-gray-500">
                            Application tracking and internship listings will appear here once you start exploring opportunities.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Browse Internships →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
