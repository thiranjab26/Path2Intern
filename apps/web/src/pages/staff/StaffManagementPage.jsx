import { useState, useEffect } from "react";
import {
    inviteStaff, listStaff, regenerateCode,
    updateStaff, updateStatus, deleteStaff,
} from "../../services/staffApi";

const MODULE_OPTIONS = [
    { code: "DS", label: "Data Science" },
    { code: "SE", label: "Software Engineering" },
    { code: "QA", label: "Quality Assurance" },
    { code: "BA", label: "Business Analysis" },
    { code: "PM", label: "Project Management" },
];

const ROLE_OPTIONS = [
    { value: "MODULE_MANAGER", label: "Module Manager" },
    { value: "MODULE_OPERATOR", label: "Module Operator" },
];

const STATUS_STYLES = {
    ACTIVE: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
    INVITED: { bg: "bg-amber-100", text: "text-amber-700", label: "Invited" },
    SUSPENDED: { bg: "bg-red-100", text: "text-red-700", label: "Suspended" },
};

function ModuleChip({ code }) {
    return (
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 mr-1">
            {code}
        </span>
    );
}

function CopyCodeBox({ code, expiresAt, onClose }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-amber-800">✅ Invite Created — share this code</p>
                <button onClick={onClose} className="text-amber-400 hover:text-amber-600 text-lg leading-none">×</button>
            </div>
            <div className="flex items-center gap-3">
                <code className="flex-1 text-2xl font-mono tracking-widest font-bold text-amber-900 bg-white border border-amber-200 rounded-xl px-4 py-3 text-center">
                    {code}
                </code>
                <button
                    onClick={copy}
                    className="px-4 py-3 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <p className="text-xs text-amber-600 mt-2">
                Expires: {new Date(expiresAt).toLocaleString()}. Give this code to the staff member — they'll use it at <strong>/accept-invite</strong>.
            </p>
        </div>
    );
}

export default function StaffManagementPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [freshCode, setFreshCode] = useState(null); // { code, expiresAt }
    const [actionLoading, setActionLoading] = useState({});

    // Invite form state
    const [form, setForm] = useState({ name: "", email: "", staffRole: "MODULE_MANAGER", moduleScopes: [] });
    const [inviting, setInviting] = useState(false);
    const [formError, setFormError] = useState("");

    // Edit modal state
    const [editing, setEditing] = useState(null); // { id, staffRole, moduleScopes }

    const fetchStaff = async () => {
        try {
            const res = await listStaff();
            setStaff(res.data.staff || []);
        } catch {
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaff(); }, []);

    const toggleModule = (code) => {
        setForm((f) => ({
            ...f,
            moduleScopes: f.moduleScopes.includes(code)
                ? f.moduleScopes.filter((m) => m !== code)
                : [...f.moduleScopes, code],
        }));
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setFormError("");
        if (form.moduleScopes.length === 0) return setFormError("Select at least one module.");
        setInviting(true);
        try {
            const res = await inviteStaff(form);
            setFreshCode({ code: res.data.inviteCode, expiresAt: res.data.expiresAt });
            setForm({ name: "", email: "", staffRole: "MODULE_MANAGER", moduleScopes: [] });
            fetchStaff();
        } catch (err) {
            setFormError(err.response?.data?.message || "Invite failed.");
        } finally {
            setInviting(false);
        }
    };

    const handleRegenerate = async (id) => {
        setActionLoading((p) => ({ ...p, [id]: "regen" }));
        try {
            const res = await regenerateCode(id);
            setFreshCode({ code: res.data.inviteCode, expiresAt: res.data.expiresAt });
        } catch (err) {
            alert(err.response?.data?.message || "Failed.");
        } finally {
            setActionLoading((p) => ({ ...p, [id]: null }));
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
        setActionLoading((p) => ({ ...p, [id]: "status" }));
        try {
            await updateStatus(id, newStatus);
            fetchStaff();
        } catch (err) {
            alert(err.response?.data?.message || "Failed.");
        } finally {
            setActionLoading((p) => ({ ...p, [id]: null }));
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove ${name}? This cannot be undone.`)) return;
        setActionLoading((p) => ({ ...p, [id]: "delete" }));
        try {
            await deleteStaff(id);
            fetchStaff();
        } catch (err) {
            alert(err.response?.data?.message || "Failed.");
        } finally {
            setActionLoading((p) => ({ ...p, [id]: null }));
        }
    };

    const handleSaveEdit = async () => {
        if (!editing) return;
        if (editing.moduleScopes.length === 0) return;
        setActionLoading((p) => ({ ...p, [editing.id]: "edit" }));
        try {
            await updateStaff(editing.id, { staffRole: editing.staffRole, moduleScopes: editing.moduleScopes });
            setEditing(null);
            fetchStaff();
        } catch (err) {
            alert(err.response?.data?.message || "Failed.");
        } finally {
            setActionLoading((p) => ({ ...p, [editing.id]: null }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-10 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        University Admin
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">Staff Management</h1>
                    <p className="text-amber-100 mt-1 text-sm">
                        Invite staff, assign module roles, and manage access.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Fresh invite code */}
                {freshCode && (
                    <CopyCodeBox
                        code={freshCode.code}
                        expiresAt={freshCode.expiresAt}
                        onClose={() => setFreshCode(null)}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Invite form ─────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xs font-bold">+</span>
                            Invite Staff
                        </h2>

                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="Jane Smith"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="jane@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Any email (gmail, outlook, etc.)</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Staff Role</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                    value={form.staffRole}
                                    onChange={(e) => setForm((f) => ({ ...f, staffRole: e.target.value }))}
                                >
                                    {ROLE_OPTIONS.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Module Scopes</label>
                                <div className="flex flex-wrap gap-2">
                                    {MODULE_OPTIONS.map((m) => (
                                        <button
                                            key={m.code}
                                            type="button"
                                            onClick={() => toggleModule(m.code)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${form.moduleScopes.includes(m.code)
                                                    ? "bg-amber-500 border-amber-500 text-white"
                                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-amber-300"
                                                }`}
                                        >
                                            {m.code}
                                        </button>
                                    ))}
                                </div>
                                {form.moduleScopes.length > 0 && (
                                    <p className="text-xs text-amber-700 mt-1.5">
                                        Selected: {form.moduleScopes.map(c => MODULE_OPTIONS.find(m => m.code === c)?.label).join(", ")}
                                    </p>
                                )}
                            </div>

                            {formError && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={inviting}
                                className="w-full py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {inviting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {inviting ? "Creating invite..." : "Generate Invite Code"}
                            </button>
                        </form>
                    </div>

                    {/* ── Staff table ─────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-800">All Staff</h2>
                            <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-full">{staff.length}</span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : staff.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 text-sm">
                                No staff yet. Use the form to invite your first staff member.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {staff.map((s) => {
                                    const sc = STATUS_STYLES[s.status] || {};
                                    const busy = !!actionLoading[s._id];
                                    return (
                                        <div key={s._id} className="px-5 py-4">
                                            {editing?.id === s._id ? (
                                                // ─ Edit row ─
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <p className="font-semibold text-sm text-gray-900">{s.name}</p>
                                                        <p className="text-xs text-gray-400">{s.email}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        <select
                                                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-violet-400 focus:outline-none"
                                                            value={editing.staffRole}
                                                            onChange={(e) => setEditing((ed) => ({ ...ed, staffRole: e.target.value }))}
                                                        >
                                                            {ROLE_OPTIONS.map((r) => (
                                                                <option key={r.value} value={r.value}>{r.label}</option>
                                                            ))}
                                                        </select>
                                                        {MODULE_OPTIONS.map((m) => (
                                                            <button
                                                                key={m.code}
                                                                type="button"
                                                                onClick={() => setEditing((ed) => ({
                                                                    ...ed,
                                                                    moduleScopes: ed.moduleScopes.includes(m.code)
                                                                        ? ed.moduleScopes.filter((x) => x !== m.code)
                                                                        : [...ed.moduleScopes, m.code],
                                                                }))}
                                                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${editing.moduleScopes.includes(m.code)
                                                                        ? "bg-violet-600 border-violet-600 text-white"
                                                                        : "bg-gray-50 border-gray-200 text-gray-600"
                                                                    }`}
                                                            >
                                                                {m.code}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={handleSaveEdit} disabled={busy} className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50">
                                                            {actionLoading[s._id] === "edit" ? "Saving..." : "Save"}
                                                        </button>
                                                        <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // ─ View row ─
                                                <div className="flex items-start gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                        {s.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{sc.label}</span>
                                                            <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">
                                                                {s.staffRole === "MODULE_MANAGER" ? "Manager" : "Operator"}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-0.5">{s.email}</p>
                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                            {(s.moduleScopes || []).map((m) => <ModuleChip key={m} code={m} />)}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                                                        {/* Edit */}
                                                        <button
                                                            onClick={() => setEditing({ id: s._id, staffRole: s.staffRole, moduleScopes: [...(s.moduleScopes || [])] })}
                                                            disabled={busy}
                                                            title="Edit role/modules"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors disabled:opacity-40"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        {/* Re-generate code (only INVITED) */}
                                                        {s.status === "INVITED" && (
                                                            <button
                                                                onClick={() => handleRegenerate(s._id)}
                                                                disabled={busy}
                                                                title="Regenerate invite code"
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-40"
                                                            >
                                                                {actionLoading[s._id] === "regen"
                                                                    ? <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin block" />
                                                                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                                }
                                                            </button>
                                                        )}
                                                        {/* Suspend / Reactivate */}
                                                        {s.status !== "INVITED" && (
                                                            <button
                                                                onClick={() => handleStatusToggle(s._id, s.status)}
                                                                disabled={busy}
                                                                title={s.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                                                                className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${s.status === "SUSPENDED" ? "text-gray-400 hover:text-green-600 hover:bg-green-50" : "text-gray-400 hover:text-amber-600 hover:bg-amber-50"}`}
                                                            >
                                                                {actionLoading[s._id] === "status"
                                                                    ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin block" />
                                                                    : s.status === "SUSPENDED"
                                                                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                                }
                                                            </button>
                                                        )}
                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => handleDelete(s._id, s.name)}
                                                            disabled={busy}
                                                            title="Remove staff"
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                                                        >
                                                            {actionLoading[s._id] === "delete"
                                                                ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin block" />
                                                                : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
