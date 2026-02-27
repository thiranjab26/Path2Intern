import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ActionCard from "../../components/ActionCard";



export default function UniversityAdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-10 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            University Admin
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">University Control Panel</h1>
                    <p className="text-amber-100 mt-1 text-sm">
                        Manage universities, departments, organizations, and student verification.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Universities", value: "—", color: "bg-amber-500" },
                        { label: "Departments", value: "—", color: "bg-orange-500" },
                        { label: "Pending Orgs", value: "—", color: "bg-yellow-500" },
                        { label: "Verified Students", value: "—", color: "bg-lime-600" },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-xl p-5 text-white ${s.color} shadow-md`}>
                            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{s.label}</p>
                            <p className="text-3xl font-bold mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ActionCard
                        to="#"
                        accent="bg-amber-100"
                        title="Manage Universities"
                        description="Add, edit, or remove university records on the platform."
                        icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-orange-100"
                        title="Manage Departments"
                        description="Configure faculties and departments within your university."
                        icon={<svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-yellow-100"
                        title="Approve / Block Orgs"
                        description="Review and approve organizations affiliated with your university."
                        icon={<svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-lime-100"
                        title="Student Verification Rules"
                        description="Set email domain rules and eligibility criteria for students."
                        icon={<svg className="w-5 h-5 text-lime-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                    />
                    <ActionCard
                        to="/module/assign-manager"
                        accent="bg-teal-100"
                        title="Assign Module Managers"
                        description="Assign MODULE_MANAGER roles for DS, SE, QA, BA, or PM modules."
                        icon={<svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    />
                    <ActionCard
                        to="#"
                        accent="bg-sky-100"
                        title="University Analytics"
                        description="View stats: applications, placements, and internship success rates."
                        icon={<svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    />
                </div>
            </div>
        </div>
    );
}
