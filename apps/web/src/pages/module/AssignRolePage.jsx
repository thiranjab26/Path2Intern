import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { assignManager, assignOperator, removeRole, listRoles } from "../../services/moduleApi";

const MODULE_OPTIONS = [
    { code: "DS", label: "Data Science" },
    { code: "SE", label: "Software Engineering" },
    { code: "QA", label: "Quality Assurance" },
    { code: "BA", label: "Business Analysis" },
    { code: "PM", label: "Project Management" },
];

const ROLE_COLORS = {
    MODULE_MANAGER: { bg: "bg-purple-100", text: "text-purple-700", label: "Manager" },
    MODULE_OPERATOR: { bg: "bg-violet-100", text: "text-violet-700", label: "Operator" },
};

/**
 * Props:
 *   mode: "manager" | "operator"
 *     "manager"  → used by University Admin to assign MODULE_MANAGERs
 *     "operator" → used by Module Manager to assign MODULE_OPERATORs
 */
export default function AssignRolePage({ mode = "manager" }) {
    const { user } = useAuth();
    const isManagerMode = mode === "manager";
    const heading = isManagerMode ? "Assign Module Managers" : "Assign Module Operators";
    const roleLabel = isManagerMode ? "Module Manager" : "Module Operator";
    const gradientClass = isManagerMode
        ? "from-amber-500 to-orange-500"
        : "from-violet-600 to-purple-600";

    // For operator mode: limit module selector to manager's own modules
    const ownModules = isManagerMode
        ? MODULE_OPTIONS
        : MODULE_OPTIONS.filter((m) =>
            user?.moduleScopedRoles?.some((r) => r.module === m.code && r.role === "MODULE_MANAGER")
        );

    const [selectedModule, setSelectedModule] = useState(ownModules[0]?.code || "");
    const [email, setEmail] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [assignMessage, setAssignMessage] = useState(null); // { type, text }
    const [roleList, setRoleList] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const fetchRoles = useCallback(async () => {
        if (!selectedModule) return;
        setListLoading(true);
        try {
            const res = await listRoles(selectedModule);
            setRoleList(res.data.roles || []);
        } catch {
            setRoleList([]);
        } finally {
            setListLoading(false);
        }
    }, [selectedModule]);

    useEffect(() => { fetchRoles(); }, [fetchRoles]);

    const handleAssign = async (e) => {
        e.preventDefault();
        setAssignMessage(null);
        setAssigning(true);
        try {
            const fn = isManagerMode ? assignManager : assignOperator;
            const res = await fn(email, selectedModule);
            setAssignMessage({ type: "success", text: res.data.message });
            setEmail("");
            fetchRoles();
        } catch (err) {
            setAssignMessage({ type: "error", text: err.response?.data?.message || "Assignment failed." });
        } finally {
            setAssigning(false);
        }
    };

    const handleRemove = async (targetEmail, targetModule) => {
        const key = `${targetEmail}-${targetModule}`;
        setRemovingId(key);
        try {
            await removeRole(targetEmail, targetModule);
            fetchRoles();
        } catch (err) {
            alert(err.response?.data?.message || "Could not remove role.");
        } finally {
            setRemovingId(null);
        }
    };

    // Filter role list based on mode
    const filteredRoles = isManagerMode
        ? roleList.filter((r) => r.role === "MODULE_MANAGER")
        : roleList.filter((r) => r.role === "MODULE_OPERATOR");

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradientClass} px-8 py-10 shadow-md`}>
                <div className="max-w-5xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {isManagerMode ? "University Admin" : "Module Manager"}
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">{heading}</h1>
                    <p className="text-white/80 mt-1 text-sm">
                        {isManagerMode
                            ? "Assign Module Managers to oversee content and operators for each module."
                            : "Add Module Operators who can submit MCQs for your module's question bank."}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assignment form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">Assign a {roleLabel}</h2>

                    <form onSubmit={handleAssign} className="space-y-4">
                        {/* Module */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Module</label>
                            <select
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                                required
                            >
                                {ownModules.map((m) => (
                                    <option key={m.code} value={m.code}>{m.code} — {m.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                User Email
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Message */}
                        {assignMessage && (
                            <div className={`rounded-lg px-3 py-2.5 text-sm font-medium ${assignMessage.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                {assignMessage.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={assigning || ownModules.length === 0}
                            className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            {assigning && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {assigning ? "Assigning..." : `Assign as ${roleLabel}`}
                        </button>
                    </form>
                </div>

                {/* Current role holders */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-800">
                            Current {roleLabel}s
                        </h2>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            {filteredRoles.length} assigned
                        </span>
                    </div>

                    {listLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-3 border-violet-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredRoles.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            No {roleLabel.toLowerCase()}s assigned to this module yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredRoles.map((r) => {
                                const c = ROLE_COLORS[r.role] || {};
                                const key = `${r.user?.email}-${r.module}`;
                                return (
                                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {r.user?.name?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{r.user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{r.user?.email}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${c.bg} ${c.text}`}>
                                            {c.label}
                                        </span>
                                        <button
                                            onClick={() => handleRemove(r.user?.email, r.module)}
                                            disabled={removingId === key}
                                            className="ml-1 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                                            title="Remove role"
                                        >
                                            {removingId === key ? (
                                                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin block" />
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
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
