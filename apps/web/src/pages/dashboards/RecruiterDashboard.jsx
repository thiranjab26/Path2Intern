import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ActionCard from "../../components/ActionCard";



const ApplicationRow = ({ name, role, status }) => {
    const colors = {
        Pending: "bg-yellow-100 text-yellow-700",
        Shortlisted: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-700",
    };
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-400">{role}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[status]}`}>{status}</span>
        </div>
    );
};

export default function RecruiterDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-10 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Recruiter
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">Recruiter Dashboard</h1>
                    <p className="text-green-100 mt-1 text-sm">
                        Post internships, manage applications, and shortlist top candidates.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Active Listings", value: "—", color: "bg-green-500" },
                        { label: "Total Applications", value: "—", color: "bg-emerald-500" },
                        { label: "Shortlisted", value: "—", color: "bg-teal-500" },
                        { label: "Positions Filled", value: "—", color: "bg-cyan-600" },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-xl p-5 text-white ${s.color} shadow-md`}>
                            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{s.label}</p>
                            <p className="text-3xl font-bold mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Action cards */}
                    <div className="lg:col-span-2">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ActionCard
                                to="#"
                                accent="bg-green-100"
                                title="Post Internship"
                                description="Create a new internship listing for your organization."
                                icon={<svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                            />
                            <ActionCard
                                to="#"
                                accent="bg-emerald-100"
                                title="My Listings"
                                description="View and manage all your posted internship opportunities."
                                icon={<svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                            />
                            <ActionCard
                                to="#"
                                accent="bg-teal-100"
                                title="Review Applications"
                                description="See all applications submitted for your listings."
                                icon={<svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                            />
                            <ActionCard
                                to="#"
                                accent="bg-cyan-100"
                                title="Shortlist Candidates"
                                description="Mark top candidates and update their application status."
                                icon={<svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                            />
                        </div>
                    </div>

                    {/* Recent applications panel */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Applications</h3>
                        <ApplicationRow name="Amal Perera" role="SE Intern" status="Pending" />
                        <ApplicationRow name="Siya Fernando" role="DS Intern" status="Shortlisted" />
                        <ApplicationRow name="Tharindu Silva" role="QA Intern" status="Rejected" />
                        <ApplicationRow name="Nadeesha K." role="SE Intern" status="Pending" />
                        <p className="text-xs text-blue-500 hover:underline cursor-pointer mt-3 text-center">
                            View all applications →
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
