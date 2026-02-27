import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const StatCard = ({ label, value, icon, accent }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
            <span className="text-lg">{icon}</span>
        </div>
        <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    </div>
);

const DarkActionCard = ({ to, icon, title, description, disabled }) => (
    <Link
        to={disabled ? "#" : to}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
        className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 ${disabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:border-green-500/30 hover:bg-slate-900/80 hover:-translate-y-0.5 hover:shadow-lg"
            }`}
    >
        <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-white mb-1">{title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
    </Link>
);

const ApplicationRow = ({ name, role, status }) => {
    const colors = {
        Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Shortlisted: "bg-green-500/10  text-green-400  border-green-500/20",
        Rejected: "bg-red-500/10    text-red-400    border-red-500/20",
    };
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
            <div>
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-xs text-slate-500">{role}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${colors[status]}`}>{status}</span>
        </div>
    );
};

export default function RecruiterDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#0a0f1e]">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-8">
                <div className="max-w-7xl mx-auto flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-500/30 uppercase tracking-wider">
                            Organisation
                        </span>
                        <h1 className="text-3xl font-bold text-white mt-2">
                            {user?.organizationName || user?.name || "Organisation"} Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">
                            Post internships, manage applications, and shortlist top candidates.
                        </p>
                    </div>
                    <Link to="/org/post-job"
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-green-600/20 flex-shrink-0 mt-1">
                        + Post a Job
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard label="Active Listings" value="—" icon="📋" accent="text-green-400" />
                    <StatCard label="Total Applications" value="—" icon="📝" accent="text-emerald-400" />
                    <StatCard label="Shortlisted" value="—" icon="⭐" accent="text-teal-400" />
                    <StatCard label="Positions Filled" value="—" icon="✅" accent="text-cyan-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Action cards */}
                    <div className="lg:col-span-2">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DarkActionCard to="/org/post-job" icon="➕" title="Post Internship" description="Create a new internship listing for your organisation." />
                            <DarkActionCard to="/org/post-job" icon="📋" title="My Listings" description="View and manage all your posted internship opportunities." />
                            <DarkActionCard to="#" icon="👀" title="Review Applications" description="See all applications submitted for your listings." disabled />
                            <DarkActionCard to="#" icon="⭐" title="Shortlist Candidates" description="Mark top candidates and update their application status." disabled />
                        </div>
                    </div>

                    {/* Recent applications */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Recent Applications</h3>
                        <ApplicationRow name="Amal Perera" role="SE Intern" status="Pending" />
                        <ApplicationRow name="Siya Fernando" role="DS Intern" status="Shortlisted" />
                        <ApplicationRow name="Tharindu Silva" role="QA Intern" status="Rejected" />
                        <ApplicationRow name="Nadeesha K." role="SE Intern" status="Pending" />
                        <p className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer mt-4 text-center transition-colors">
                            View all applications →
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
