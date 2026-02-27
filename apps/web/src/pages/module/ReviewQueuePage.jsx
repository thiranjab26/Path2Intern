import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getPendingQuestions, reviewQuestion } from "../../services/moduleApi";

const MODULE_COLORS = {
    DS: { bg: "bg-violet-600", label: "Data Science" },
    SE: { bg: "bg-blue-600", label: "Software Engineering" },
    QA: { bg: "bg-green-600", label: "Quality Assurance" },
    BA: { bg: "bg-amber-500", label: "Business Analysis" },
    PM: { bg: "bg-pink-600", label: "Project Management" },
};

function QuestionCard({ question, onReviewed }) {
    const [declining, setDeclining] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAction = async (action) => {
        if (action === "decline" && !reason.trim()) {
            setError("Please enter a reason for declining.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await reviewQuestion(question._id, action, reason);
            onReviewed(question._id, action);
        } catch (err) {
            setError(err.response?.data?.message || "Action failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            {/* Meta row */}
            <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${MODULE_COLORS[question.module]?.bg || "bg-gray-500"}`}>
                    {question.module}
                </span>
                <span className="text-xs text-gray-400">
                    submitted by <strong className="text-gray-600">{question.submittedBy?.name || "Unknown"}</strong>
                </span>
                <span className="text-xs text-gray-400 ml-auto">{new Date(question.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Question */}
            <p className="text-sm font-semibold text-gray-900 mb-4 leading-relaxed">{question.questionText}</p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {question.options.map((opt) => (
                    <div
                        key={opt.label}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border ${opt.label === question.correctOption
                                ? "bg-green-50 border-green-300 text-green-800 font-medium"
                                : "bg-gray-50 border-gray-200 text-gray-700"
                            }`}
                    >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${opt.label === question.correctOption ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                            }`}>{opt.label}</span>
                        {opt.text}
                        {opt.label === question.correctOption && (
                            <svg className="w-4 h-4 ml-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                ))}
            </div>

            {/* Explanation */}
            {question.explanation && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-blue-700"><strong>Explanation:</strong> {question.explanation}</p>
                </div>
            )}

            {/* Decline reason input */}
            {declining && (
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Reason for declining</label>
                    <textarea
                        rows={2}
                        className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                        placeholder="Explain why this question is being declined..."
                        value={reason}
                        onChange={(e) => { setReason(e.target.value); setError(""); }}
                    />
                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => handleAction("approve")}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                </button>

                {!declining ? (
                    <button
                        onClick={() => setDeclining(true)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Decline
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => handleAction("decline")}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "..." : "Confirm Decline"}
                        </button>
                        <button
                            onClick={() => { setDeclining(false); setReason(""); setError(""); }}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ReviewQueuePage() {
    const { user } = useAuth();

    // Modules where this user is a MODULE_MANAGER
    const managerModules = (user?.moduleScopedRoles || [])
        .filter((r) => r.role === "MODULE_MANAGER")
        .map((r) => r.module);

    const [activeModule, setActiveModule] = useState(managerModules[0] || "");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");

    const fetchPending = useCallback(async () => {
        if (!activeModule) return;
        setLoading(true);
        setFetchError("");
        try {
            const res = await getPendingQuestions(activeModule);
            setQuestions(res.data.questions || []);
        } catch (err) {
            setFetchError(err.response?.data?.message || "Failed to load questions.");
        } finally {
            setLoading(false);
        }
    }, [activeModule]);

    useEffect(() => { fetchPending(); }, [fetchPending]);

    const handleReviewed = (id) => {
        setQuestions((prev) => prev.filter((q) => q._id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-700 to-purple-600 px-8 py-10 shadow-md">
                <div className="max-w-5xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Module Manager
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">Review Queue</h1>
                    <p className="text-purple-100 mt-1 text-sm">
                        Review and approve or decline MCQs submitted by module operators.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Module tabs */}
                {managerModules.length > 1 && (
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {managerModules.map((mod) => (
                            <button
                                key={mod}
                                onClick={() => setActiveModule(mod)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeModule === mod
                                        ? "bg-violet-600 text-white shadow"
                                        : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
                                    }`}
                            >
                                {MODULE_COLORS[mod]?.label || mod}
                            </button>
                        ))}
                    </div>
                )}

                {/* Count badge */}
                {!loading && !fetchError && (
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-base font-semibold text-gray-700">
                            Pending for {MODULE_COLORS[activeModule]?.label || activeModule}
                        </h2>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${questions.length > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                            }`}>
                            {questions.length}
                        </span>
                    </div>
                )}

                {/* States */}
                {loading && (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {fetchError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{fetchError}</div>
                )}

                {!loading && !fetchError && questions.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-700 font-semibold mb-1">All clear!</h3>
                        <p className="text-gray-400 text-sm">No pending questions for this module.</p>
                    </div>
                )}

                {!loading && !fetchError && questions.length > 0 && (
                    <div className="space-y-4">
                        {questions.map((q) => (
                            <QuestionCard key={q._id} question={q} onReviewed={handleReviewed} />
                        ))}
                    </div>
                )}

                {managerModules.length === 0 && (
                    <p className="text-center text-gray-400 text-sm mt-8">
                        You have no MODULE_MANAGER assignments.
                    </p>
                )}
            </div>
        </div>
    );
}
