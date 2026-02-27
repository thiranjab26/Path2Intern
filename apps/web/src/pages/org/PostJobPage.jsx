import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const EDIT_WINDOW_MS = 10 * 60 * 1000;

const inp = "w-full px-3 py-2.5 border border-slate-700 rounded-xl text-sm bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition";
const JOB_TYPES = ["Internship", "Part-time", "Full-time"];
const WORK_MODES = ["Remote", "Hybrid", "On-site"];

function TimeRemaining({ editExpiresAt }) {
    const [remaining, setRemaining] = useState("");
    useEffect(() => {
        const update = () => {
            const ms = new Date(editExpiresAt).getTime() - Date.now();
            if (ms <= 0) { setRemaining(""); return; }
            const m = Math.floor(ms / 60000);
            const s = Math.floor((ms % 60000) / 1000);
            setRemaining(`${m}m ${s}s`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [editExpiresAt]);
    if (!remaining) return null;
    return <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">⏱ Edit: {remaining}</span>;
}

const emptyForm = { title: "", company: "", location: "", workMode: "Hybrid", type: "Internship", duration: "", salary: "", skills: "", requirements: "", deadline: "" };

export default function PostJobPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/jobs/mine");
            setJobs(res.data.jobs || []);
        } catch (e) {
            setError(e.response?.data?.message || "Failed to load jobs");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(""); setSuccess(""); setFormLoading(true);
        try {
            const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean), deadline: form.deadline || null };
            if (editingId) { await api.put(`/api/jobs/${editingId}`, payload); setSuccess("Job updated successfully."); }
            else { await api.post("/api/jobs", payload); setSuccess("Job posted! It will appear on the home page. You can edit within 10 minutes."); }
            setForm(emptyForm); setEditingId(null); setShowForm(false); fetchJobs();
        } catch (e) { setError(e.response?.data?.message || "Failed to save job"); }
        finally { setFormLoading(false); }
    };

    const startEdit = (job) => {
        setForm({
            title: job.title, company: job.company, location: job.location, workMode: job.workMode, type: job.type,
            duration: job.duration || "", salary: job.salary || "", skills: (job.skills || []).join(", "),
            requirements: job.requirements || "", deadline: job.deadline ? job.deadline.slice(0, 10) : ""
        });
        setEditingId(job._id); setError(""); setSuccess(""); setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); setError(""); };

    const handleDelete = async () => {
        setDeleting(true);
        try { await api.delete(`/api/jobs/${deleteId}`); setJobs((js) => js.filter((j) => j._id !== deleteId)); setDeleteId(null); }
        catch (e) { alert(e.response?.data?.message || "Failed to delete"); }
        finally { setDeleting(false); }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1e]">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-8">
                <div className="max-w-5xl mx-auto flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-500/30 uppercase tracking-wider">Organisation</span>
                        <h1 className="text-3xl font-bold text-white mt-2">Job Postings</h1>
                        <p className="text-slate-400 mt-1 text-sm">Post internships to reach SLIIT students. Edit within 10 minutes of posting.</p>
                    </div>
                    {!showForm && (
                        <button onClick={() => { setShowForm(true); setForm(emptyForm); setEditingId(null); }}
                            className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-green-600/20 mt-1">
                            + Post a Job
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Alerts */}
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
                {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3">{success}</div>}

                {/* Post / Edit form */}
                {showForm && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-bold text-white">{editingId ? "Edit Job Post" : "New Job Post"}</h2>
                            <button onClick={cancelForm} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Job Title *</label><input required value={form.title} onChange={set("title")} className={inp} placeholder="e.g. Software Engineering Intern" /></div>
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Company *</label><input required value={form.company} onChange={set("company")} className={inp} placeholder="Your company name" /></div>
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Location *</label><input required value={form.location} onChange={set("location")} className={inp} placeholder="e.g. Colombo, Sri Lanka" /></div>
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Work Mode</label>
                                    <select value={form.workMode} onChange={set("workMode")} className={inp}>
                                        {WORK_MODES.map((m) => <option key={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Job Type</label>
                                    <select value={form.type} onChange={set("type")} className={inp}>
                                        {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Duration</label><input value={form.duration} onChange={set("duration")} className={inp} placeholder="e.g. 3 months" /></div>
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Salary / Stipend</label><input value={form.salary} onChange={set("salary")} className={inp} placeholder="e.g. LKR 25,000/month" /></div>
                                <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Application Deadline</label><input type="date" value={form.deadline} onChange={set("deadline")} className={inp} /></div>
                            </div>
                            <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Skills (comma-separated)</label><input value={form.skills} onChange={set("skills")} className={inp} placeholder="React, Node.js, MongoDB" /></div>
                            <div><label className="block text-xs font-semibold text-slate-400 mb-1.5">Job Description *</label><textarea required rows={4} value={form.requirements} onChange={set("requirements")} className={`${inp} resize-none`} placeholder="Describe the role, responsibilities, and requirements…" /></div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={cancelForm} className="border border-slate-600 text-slate-400 px-5 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors">Cancel</button>
                                <button type="submit" disabled={formLoading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors">
                                    {formLoading ? "Saving…" : editingId ? "Update Post" : "Post Job"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Job listings */}
                <div>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Your Postings ({jobs.length})</h2>
                    {loading && <div className="text-center py-12 text-slate-500">Loading…</div>}
                    {!loading && jobs.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">📋</p>
                            <p className="text-sm text-slate-400">No jobs posted yet. Click "Post a Job" to get started.</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                                <div className="flex items-start gap-4 flex-wrap">
                                    <div className="w-11 h-11 rounded-xl bg-green-500/20 text-green-400 font-bold text-base flex items-center justify-center flex-shrink-0 border border-green-500/20">
                                        {job.company?.[0]?.toUpperCase() || "J"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold text-white text-sm">{job.title}</h3>
                                            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">{job.type}</span>
                                            <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">{job.workMode}</span>
                                            {job.canEdit && <TimeRemaining editExpiresAt={job.editExpiresAt} />}
                                        </div>
                                        <p className="text-sm text-slate-400">{job.company} · {job.location}</p>
                                        {job.salary && <p className="text-xs text-slate-500 mt-0.5">{job.salary}</p>}
                                        {job.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {job.skills.map((s) => <span key={s} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">{s}</span>)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {job.canEdit ? (
                                            <button onClick={() => startEdit(job)} className="px-3 py-1.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors">Edit</button>
                                        ) : (
                                            <span className="px-3 py-1.5 text-xs font-medium text-slate-600 rounded-xl bg-slate-800 cursor-not-allowed">Edit expired</span>
                                        )}
                                        <button onClick={() => setDeleteId(job._id)} className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                        <div className="text-4xl mb-3">🗑️</div>
                        <h3 className="text-lg font-bold text-white mb-2">Delete Job Post?</h3>
                        <p className="text-sm text-slate-400 mb-6">This will remove the listing from the platform permanently.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteId(null)} className="border border-slate-600 text-slate-400 px-5 py-2 rounded-xl text-sm">Cancel</button>
                            <button disabled={deleting} onClick={handleDelete} className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors">
                                {deleting ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
