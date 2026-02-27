import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const MODULES = [
    { code: "DS", label: "Data Science" },
    { code: "SE", label: "Software Engineering" },
    { code: "QA", label: "Quality Assurance" },
    { code: "BA", label: "Business Analysis" },
    { code: "PM", label: "Project Management" },
];

const MODULE_COLORS = {
    DS: { bg: "bg-violet-600", light: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
    SE: { bg: "bg-blue-600", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
    QA: { bg: "bg-green-600", light: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
    BA: { bg: "bg-amber-500", light: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    PM: { bg: "bg-pink-600", light: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", badge: "bg-pink-100 text-pink-700" },
};

const STATUS_CHIP = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
};

function EditModal({ question, onClose, onSave }) {
    const [form, setForm] = useState({
        questionText: question.questionText,
        explanation: question.explanation || "",
        correctOption: question.correctOption,
        options: question.options.map((o) => ({ label: o.label, text: o.text })),
    });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const setOption = (label, text) =>
        setForm((f) => ({ ...f, options: f.options.map((o) => (o.label === label ? { label, text } : o)) }));

    const save = async () => {
        setSaving(true);
        setErr("");
        try {
            await api.patch(`/api/module/questions/${question._id}`, form);
            onSave();
        } catch (e) {
            setErr(e.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Edit Question</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    {err && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-3 py-2">{err}</div>}

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Question</label>
                        <textarea
                            rows={3}
                            value={form.questionText}
                            onChange={(e) => setForm((f) => ({ ...f, questionText: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                        />
                    </div>

                    {form.options.map((opt) => (
                        <div key={opt.label}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Option {opt.label}
                                {opt.label === form.correctOption && <span className="ml-2 text-green-600">✓ Correct</span>}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    value={opt.text}
                                    onChange={(e) => setOption(opt.label, e.target.value)}
                                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                                <button
                                    onClick={() => setForm((f) => ({ ...f, correctOption: opt.label }))}
                                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${form.correctOption === opt.label ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                                >
                                    Correct
                                </button>
                            </div>
                        </div>
                    ))}

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Explanation (optional)</label>
                        <textarea rows={2} value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
                    </div>
                </div>
                <div className="px-6 pb-6 flex justify-end gap-3">
                    <button onClick={onClose} className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
                    <button disabled={saving} onClick={save} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function QuestionBankPage() {
    const { user } = useAuth();

    const isManager = user?.moduleScopedRoles?.some((r) => r.role === "MODULE_MANAGER");
    const myModules = user?.moduleScopedRoles?.map((r) => r.module) || [];

    const [activeModule, setActiveModule] = useState(myModules[0] || "DS");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editTarget, setEditTarget] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchQuestions = async (module) => {
        setLoading(true);
        setError("");
        try {
            if (isManager) {
                const res = await api.get(`/api/module/questions/${module}`);
                setQuestions(res.data.questions || []);
            } else {
                // Operators see only their own submissions
                const res = await api.get("/api/module/questions/my-submissions");
                setQuestions((res.data.questions || []).filter((q) => q.module === module));
            }
        } catch (e) {
            setError(e.response?.data?.message || "Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuestions(activeModule); }, [activeModule]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/api/module/questions/${deleteId}`);
            setQuestions((qs) => qs.filter((q) => q._id !== deleteId));
            setDeleteId(null);
        } catch (e) {
            alert(e.response?.data?.message || "Failed to delete");
        } finally {
            setDeleting(false);
        }
    };

    const c = MODULE_COLORS[activeModule] || MODULE_COLORS.DS;
    const filtered = filterStatus === "all" ? questions : questions.filter((q) => q.status === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className={`bg-gradient-to-r ${activeModule === "DS" ? "from-violet-600 to-purple-600" : activeModule === "SE" ? "from-blue-600 to-indigo-600" : activeModule === "QA" ? "from-green-600 to-emerald-600" : activeModule === "BA" ? "from-amber-500 to-orange-500" : "from-pink-600 to-rose-600"} px-8 py-10 shadow-md`}>
                <div className="max-w-6xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {isManager ? "Module Manager" : "Module Operator"}
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">Question Bank</h1>
                    <p className="text-white/80 mt-1 text-sm">
                        {isManager ? "Manage all questions for your modules — edit, delete and review." : "View and manage your question submissions."}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Module tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {(isManager ? myModules : [...new Set(questions.map((q) => q.module))].concat(myModules)).filter((v, i, a) => a.indexOf(v) === i).map((code) => {
                        const mc = MODULE_COLORS[code] || MODULE_COLORS.DS;
                        return (
                            <button
                                key={code}
                                onClick={() => setActiveModule(code)}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeModule === code ? `${mc.bg} text-white shadow-sm` : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                            >
                                {code} — {MODULES.find((m) => m.code === code)?.label}
                            </button>
                        );
                    })}
                    {/* For operators with no questions yet, show all their scoped modules */}
                    {!isManager && myModules.filter(m => !questions.map(q => q.module).includes(m)).map(code => (
                        <button key={code} onClick={() => setActiveModule(code)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeModule === code ? `${MODULE_COLORS[code]?.bg || "bg-gray-600"} text-white shadow-sm` : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                            {code} — {MODULES.find((m) => m.code === code)?.label}
                        </button>
                    ))}
                </div>

                {/* Status filter */}
                <div className="flex gap-2 mb-6">
                    {["all", "pending", "approved", "declined"].map((s) => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filterStatus === s ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                            {s === "all" ? `All (${questions.length})` : `${s} (${questions.filter((q) => q.status === s).length})`}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading && <div className="text-center py-16 text-gray-400">Loading…</div>}
                {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-sm">No questions found{filterStatus !== "all" ? ` with status "${filterStatus}"` : " for this module"}.</p>
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div className="space-y-3">
                        {filtered.map((q, idx) => (
                            <div key={q._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_CHIP[q.status]}`}>{q.status}</span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>{q.module}</span>
                                            {q.submittedBy?.name && <span className="text-xs text-gray-400">by {q.submittedBy.name}</span>}
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-3">{q.questionText}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options?.map((opt) => (
                                                <div key={opt.label} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${opt.label === q.correctOption ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-600"}`}>
                                                    <span className="font-bold">{opt.label}.</span> {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                        {q.explanation && <p className="text-xs text-gray-400 mt-2 italic">💡 {q.explanation}</p>}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setEditTarget(q)}
                                            className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(q._id)}
                                            className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {editTarget && (
                <EditModal
                    question={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={() => { setEditTarget(null); fetchQuestions(activeModule); }}
                />
            )}

            {/* Delete confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                        <div className="text-4xl mb-3">🗑️</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Question?</h3>
                        <p className="text-sm text-gray-500 mb-6">This cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteId(null)} className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm">Cancel</button>
                            <button disabled={deleting} onClick={handleDelete} className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60">
                                {deleting ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
