import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getPendingQuestions } from "../../services/moduleApi";

const MODULE_COLORS = {
    DS: { bg: "bg-violet-600", light: "bg-violet-100", text: "text-violet-700", label: "Data Science" },
    SE: { bg: "bg-blue-600", light: "bg-blue-100", text: "text-blue-700", label: "Software Engineering" },
    QA: { bg: "bg-green-600", light: "bg-green-100", text: "text-green-700", label: "Quality Assurance" },
    BA: { bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700", label: "Business Analysis" },
    PM: { bg: "bg-pink-600", light: "bg-pink-100", text: "text-pink-700", label: "Project Management" },
};

const ActionCard = ({ icon, title, description, to, accent, badge }) => (
    <Link
        to={to}
        className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5 flex gap-4 items-start relative"
    >
        {badge > 0 && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {badge}
            </span>
        )}
        <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        </div>
    </Link>
);

export default function ModuleManagerDashboard() {
    const { user } = useAuth();
    const moduleScopedRoles = (user?.moduleScopedRoles || []).filter((r) => r.role === "MODULE_MANAGER");

    const [pendingCount, setPendingCount] = useState(0);

    // Fetch pending count for all managed modules
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const results = await Promise.all(
                    moduleScopedRoles.map((r) => getPendingQuestions(r.module).then((res) => res.data.pending || 0))
                );
                setPendingCount(results.reduce((a, b) => a + b, 0));
            } catch {
                setPendingCount(0);
            }
        };
        if (moduleScopedRoles.length > 0) fetchAll();
    }, []);  // eslint-disable-line

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-10 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Module Manager
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">Module Manager Dashboard</h1>
                    <p className="text-purple-100 mt-1 text-sm">
                        Manage operators, review MCQ submissions, and oversee content for your assigned modules.
                    </p>

                    {/* Module pills */}
                    {moduleScopedRoles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {moduleScopedRoles.map((r) => {
                                const c = MODULE_COLORS[r.module] || {};
                                return (
                                    <span key={r.module} className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
                                        {c.label || r.module}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Questions", value: "—", color: "bg-purple-500" },
                        { label: "Pending Review", value: pendingCount, color: pendingCount > 0 ? "bg-amber-500" : "bg-violet-500" },
                        { label: "Resources", value: "—", color: "bg-fuchsia-500" },
                        { label: "Learners", value: "—", color: "bg-pink-500" },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-xl p-5 text-white ${s.color} shadow-md`}>
                            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{s.label}</p>
                            <p className="text-3xl font-bold mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Per-module cards */}
                {moduleScopedRoles.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Your Modules</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {moduleScopedRoles.map((r) => {
                                const c = MODULE_COLORS[r.module] || { bg: "bg-gray-500", light: "bg-gray-100", text: "text-gray-700", label: r.module };
                                return (
                                    <div key={r.module} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${c.bg} text-white flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                                            {r.module}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{c.label}</p>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>
                                                Module Manager
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ActionCard
                        to="/module/review"
                        accent="bg-amber-100"
                        badge={pendingCount}
                        title="Review Queue"
                        description="Approve or decline pending MCQs submitted by module operators."
                        icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <ActionCard
                        to="/module/submit-question"
                        accent="bg-purple-100"
                        title="Submit a Question"
                        description="Add your own MCQ to the question bank — published immediately."
                        icon={<svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                    />
                    <ActionCard
                        to="/module/assign-operator"
                        accent="bg-violet-100"
                        title="Manage Operators"
                        description="Assign or remove Module Operators who can contribute questions."
                        icon={<svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-fuchsia-100"
                        title="Learning Resources"
                        description="Upload articles, videos, and reading materials for your module."
                        icon={<svg className="w-5 h-5 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-pink-100"
                        title="Module Analytics"
                        description="View learner progress, quiz scores, and engagement statistics."
                        icon={<svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-indigo-100"
                        title="Leaderboard"
                        description="See top-performing students ranked by quiz scores and activity."
                        icon={<svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                    />
                </div>
            </div>
        </div>
    );
}
