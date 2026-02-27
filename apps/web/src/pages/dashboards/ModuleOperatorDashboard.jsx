import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getMySubmissions } from "../../services/moduleApi";

const MODULE_COLORS = {
    DS: { bg: "bg-violet-600", light: "bg-violet-100", text: "text-violet-700", label: "Data Science" },
    SE: { bg: "bg-blue-600", light: "bg-blue-100", text: "text-blue-700", label: "Software Engineering" },
    QA: { bg: "bg-green-600", light: "bg-green-100", text: "text-green-700", label: "Quality Assurance" },
    BA: { bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700", label: "Business Analysis" },
    PM: { bg: "bg-pink-600", light: "bg-pink-100", text: "text-pink-700", label: "Project Management" },
};

const STATUS_COLORS = {
    approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
    declined: { bg: "bg-red-100", text: "text-red-700", label: "Declined" },
};

export default function ModuleOperatorDashboard() {
    const { user } = useAuth();
    const operatorModules = (user?.moduleScopedRoles || []).filter((r) => r.role === "MODULE_OPERATOR");

    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(true);

    useEffect(() => {
        getMySubmissions()
            .then((res) => setSubmissions(res.data.questions || []))
            .catch(() => setSubmissions([]))
            .finally(() => setLoadingSubmissions(false));
    }, []);

    const stats = {
        total: submissions.length,
        approved: submissions.filter((q) => q.status === "approved").length,
        pending: submissions.filter((q) => q.status === "pending").length,
        declined: submissions.filter((q) => q.status === "declined").length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Module Operator
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">
                        Welcome back, {user?.name?.split(" ")[0]}!
                    </h1>
                    <p className="text-indigo-100 mt-1 text-sm">
                        Submit MCQs and track your contributions to the module question banks.
                    </p>

                    {/* Operator module pills */}
                    {operatorModules.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {operatorModules.map((r) => {
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
                    <div className="rounded-xl p-5 text-white bg-indigo-500 shadow-md">
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Submitted</p>
                        <p className="text-3xl font-bold mt-1">{loadingSubmissions ? "—" : stats.total}</p>
                    </div>
                    <div className="rounded-xl p-5 text-white bg-green-500 shadow-md">
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Approved</p>
                        <p className="text-3xl font-bold mt-1">{loadingSubmissions ? "—" : stats.approved}</p>
                    </div>
                    <div className="rounded-xl p-5 text-white bg-amber-500 shadow-md">
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Pending</p>
                        <p className="text-3xl font-bold mt-1">{loadingSubmissions ? "—" : stats.pending}</p>
                    </div>
                    <div className="rounded-xl p-5 text-white bg-red-500 shadow-md">
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Declined</p>
                        <p className="text-3xl font-bold mt-1">{loadingSubmissions ? "—" : stats.declined}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <Link
                        to="/module/submit-question"
                        className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5 flex gap-4 items-start"
                    >
                        <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">Submit a Question</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Add a new MCQ to your module's question bank. Submissions are reviewed by a Module Manager before going live.
                            </p>
                        </div>
                    </Link>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
                        <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">My Module Assignments</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                You are a Module Operator for:{" "}
                                {operatorModules.length > 0
                                    ? operatorModules.map((r) => MODULE_COLORS[r.module]?.label || r.module).join(", ")
                                    : "No modules assigned yet."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* My Submissions table */}
                <h2 className="text-base font-semibold text-gray-700 mb-4">My Submissions</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loadingSubmissions ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">No questions submitted yet.</p>
                            <Link to="/module/submit-question" className="inline-block mt-3 text-indigo-600 text-sm font-medium hover:underline">
                                Submit your first question →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {submissions.map((q) => {
                                const sc = STATUS_COLORS[q.status] || {};
                                const mc = MODULE_COLORS[q.module] || {};
                                return (
                                    <div key={q._id} className="px-5 py-4 flex items-start gap-4">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0 mt-0.5 ${mc.bg}`}>
                                            {q.module}
                                        </span>
                                        <p className="text-sm text-gray-800 flex-1 leading-relaxed line-clamp-2">{q.questionText}</p>
                                        <div className="flex-shrink-0 text-right space-y-1">
                                            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                                                {sc.label || q.status}
                                            </span>
                                            {q.declineReason && (
                                                <p className="text-xs text-red-500 max-w-[160px]" title={q.declineReason}>
                                                    ↳ {q.declineReason.length > 40 ? q.declineReason.slice(0, 40) + "…" : q.declineReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
