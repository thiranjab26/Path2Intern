import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { submitQuestion } from "../../services/moduleApi";

const MODULE_OPTIONS = [
    { code: "DS", label: "Data Science" },
    { code: "SE", label: "Software Engineering" },
    { code: "QA", label: "Quality Assurance" },
    { code: "BA", label: "Business Analysis" },
    { code: "PM", label: "Project Management" },
];

const OPTION_LABELS = ["A", "B", "C", "D"];

const defaultOptions = () =>
    OPTION_LABELS.map((label) => ({ label, text: "" }));

export default function SubmitQuestionPage() {
    const { user } = useAuth();

    // Derive which modules this user can submit to
    const myModules = user?.moduleScopedRoles?.map((r) => r.module) || [];
    const allowedModules = MODULE_OPTIONS.filter((m) => myModules.includes(m.code));

    const [form, setForm] = useState({
        module: allowedModules[0]?.code || "",
        questionText: "",
        options: defaultOptions(),
        correctOption: "A",
        explanation: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { type: "success"|"error", message, status }

    const setOption = (index, value) => {
        const opts = [...form.options];
        opts[index] = { ...opts[index], text: value };
        setForm((f) => ({ ...f, options: opts }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);

        // Validate all options are filled
        if (form.options.some((o) => !o.text.trim())) {
            setResult({ type: "error", message: "All four answer options must be filled in." });
            return;
        }
        if (!form.questionText.trim()) {
            setResult({ type: "error", message: "Question text cannot be empty." });
            return;
        }

        setSubmitting(true);
        try {
            const res = await submitQuestion({
                module: form.module,
                questionText: form.questionText,
                options: form.options,
                correctOption: form.correctOption,
                explanation: form.explanation || undefined,
            });
            const status = res.data.question?.status;
            setResult({
                type: "success",
                message: res.data.message,
                status,
            });
            // Reset form
            setForm((f) => ({ ...f, questionText: "", options: defaultOptions(), correctOption: "A", explanation: "" }));
        } catch (err) {
            setResult({ type: "error", message: err.response?.data?.message || "Submission failed." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-10 shadow-md">
                <div className="max-w-3xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        MCQ Submission
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">Submit a Question</h1>
                    <p className="text-purple-100 mt-1 text-sm">
                        Add a new multiple-choice question to your module's question bank.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Info banner */}
                {user?.moduleScopedRoles?.some((r) => r.role === "MODULE_OPERATOR") && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3 items-start">
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-amber-800 text-sm">
                            As a <strong>Module Operator</strong>, your question will be sent for manager review before becoming visible to students.
                        </p>
                    </div>
                )}

                {/* Result banner */}
                {result && (
                    <div className={`rounded-xl p-4 mb-6 flex gap-3 items-start ${result.type === "success"
                            ? result.status === "approved"
                                ? "bg-green-50 border border-green-200"
                                : "bg-violet-50 border border-violet-200"
                            : "bg-red-50 border border-red-200"
                        }`}>
                        <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${result.type === "success"
                                ? result.status === "approved" ? "text-green-500" : "text-violet-500"
                                : "text-red-500"
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {result.type === "success"
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            }
                        </svg>
                        <p className={`text-sm font-medium ${result.type === "success"
                                ? result.status === "approved" ? "text-green-800" : "text-violet-800"
                                : "text-red-800"
                            }`}>{result.message}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                    {/* Module selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Module</label>
                        <select
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                            value={form.module}
                            onChange={(e) => setForm((f) => ({ ...f, module: e.target.value }))}
                            required
                        >
                            {allowedModules.map((m) => (
                                <option key={m.code} value={m.code}>{m.code} — {m.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Question text */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Question</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            rows={4}
                            placeholder="Enter your question here..."
                            value={form.questionText}
                            onChange={(e) => setForm((f) => ({ ...f, questionText: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Options A–D */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Answer Options</label>
                        <div className="space-y-3">
                            {OPTION_LABELS.map((label, i) => (
                                <div key={label} className="flex items-center gap-3">
                                    {/* Radio — this option is correct */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="correctOption"
                                            value={label}
                                            checked={form.correctOption === label}
                                            onChange={(e) => setForm((f) => ({ ...f, correctOption: e.target.value }))}
                                            className="accent-violet-600 w-4 h-4"
                                        />
                                    </label>
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${form.correctOption === label ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
                                        }`}>{label}</span>
                                    <input
                                        type="text"
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        placeholder={`Option ${label}`}
                                        value={form.options[i].text}
                                        onChange={(e) => setOption(i, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Select the radio button next to the correct answer.</p>
                    </div>

                    {/* Explanation (optional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Explanation <span className="font-normal text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            rows={3}
                            placeholder="Explain why the correct answer is right..."
                            value={form.explanation}
                            onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting || allowedModules.length === 0}
                            className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {submitting ? "Submitting..." : "Submit Question"}
                        </button>
                    </div>
                </form>

                {allowedModules.length === 0 && (
                    <p className="text-center text-gray-400 text-sm mt-4">
                        You have no module assignments. Contact your Module Manager or University Admin.
                    </p>
                )}
            </div>
        </div>
    );
}
