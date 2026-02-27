import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ActionCard = ({ icon, title, description, to, accent }) => (
    <Link
        to={to}
        className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5 flex gap-4 items-start"
    >
        <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        </div>
    </Link>
);

const ProgressBar = ({ label, value, color }) => (
    <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{label}</span>
            <span className="font-semibold">{value}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
        </div>
    </div>
);

export default function StudentDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Student
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">
                        Welcome, {user?.name?.split(" ")[0] || "Student"}! 🎓
                    </h1>
                    <p className="text-blue-100 mt-1 text-sm">
                        Track your applications, learn new skills, and land your dream internship.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Applications Sent", value: "0", color: "bg-blue-500" },
                        { label: "Shortlisted", value: "0", color: "bg-indigo-500" },
                        { label: "Quizzes Done", value: "0", color: "bg-violet-500" },
                        { label: "Modules Progress", value: "0%", color: "bg-purple-500" },
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
                                to="/"
                                accent="bg-blue-100"
                                title="Browse Internships"
                                description="Explore the latest internship listings matching your skills."
                                icon={<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                            />
                            <ActionCard
                                to="#"
                                accent="bg-indigo-100"
                                title="My Applications"
                                description="View and track the status of all your submitted applications."
                                icon={<svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                            />
                            <ActionCard
                                to="#"
                                accent="bg-violet-100"
                                title="Learning Modules"
                                description="Access curated learning resources for DS, SE, QA, BA, and PM."
                                icon={<svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                            />
                            <ActionCard
                                to="#"
                                accent="bg-purple-100"
                                title="Take a Quiz"
                                description="Test your knowledge and earn progress points for your modules."
                                icon={<svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                            />
                        </div>
                    </div>

                    {/* Learning progress panel */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Learning Progress</h3>
                        <ProgressBar label="Software Engineering (SE)" value={40} color="bg-blue-500" />
                        <ProgressBar label="Data Science (DS)" value={20} color="bg-violet-500" />
                        <ProgressBar label="Quality Assurance (QA)" value={10} color="bg-green-500" />
                        <ProgressBar label="Business Analysis (BA)" value={5} color="bg-amber-500" />
                        <ProgressBar label="Project Management (PM)" value={0} color="bg-red-400" />
                        <p className="text-xs text-gray-400 mt-3">Complete quizzes to update your progress.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
