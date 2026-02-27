import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardRoute } from "../utils/roleUtils";

// --- Mocked job listings shown to logged-in users ---
const MOCK_JOBS = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "TechCorp Lanka",
    location: "Colombo, LK (Hybrid)",
    type: "3 months",
    tags: ["React", "Node.js", "MongoDB"],
    logo: "TC",
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Analytix Solutions",
    location: "Remote",
    type: "6 months",
    tags: ["Python", "ML", "Pandas"],
    logo: "AS",
    color: "bg-violet-600",
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "Creative Studio",
    location: "Colombo, LK (On-site)",
    type: "4 months",
    tags: ["Figma", "User Research", "Prototyping"],
    logo: "CS",
    color: "bg-pink-500",
  },
  {
    id: 4,
    title: "Business Analyst Intern",
    company: "FinSmart Group",
    location: "Colombo, LK (Hybrid)",
    type: "3 months",
    tags: ["Excel", "Power BI", "JIRA"],
    logo: "FG",
    color: "bg-amber-500",
  },
  {
    id: 5,
    title: "QA Testing Intern",
    company: "QualityFirst Tech",
    location: "Remote",
    type: "3 months",
    tags: ["Selenium", "Postman", "JIRA"],
    logo: "QF",
    color: "bg-green-600",
  },
  {
    id: 6,
    title: "DevOps Intern",
    company: "CloudBase Systems",
    location: "Colombo, LK (Hybrid)",
    type: "6 months",
    tags: ["Docker", "AWS", "CI/CD"],
    logo: "CB",
    color: "bg-cyan-600",
  },
];

function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <div className={`w-11 h-11 rounded-lg ${job.color} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>

      <button className="mt-auto w-full text-center text-sm font-medium text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
        View & Apply
      </button>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  // --- Logged-in view: job listings + dashboard CTA ---
  if (!loading && user) {
    const dashboardRoute = getDashboardRoute(user.globalRole, user.moduleScopedRoles);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          {/* Welcome banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-blue-100 text-sm">
                Browse the latest internship opportunities below, or head to your dashboard.
              </p>
            </div>
            <Link
              to={dashboardRoute}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Go to Dashboard
            </Link>
          </div>

          {/* Search / filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search internships, companies, skills..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
              <option value="">All locations</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
            <select className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
              <option value="">All durations</option>
              <option value="3">3 months</option>
              <option value="4">4 months</option>
              <option value="6">6 months</option>
            </select>
          </div>

          {/* Job listings header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Latest Internships
              <span className="ml-2 text-sm font-normal text-gray-400">({MOCK_JOBS.length} open)</span>
            </h2>
          </div>

          {/* Job cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Path2Intern. All rights reserved.
          </p>
        </footer>
      </div>
    );
  }

  // --- Public landing page for non-logged-in visitors ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Welcome to <span className="text-blue-600">Path2Intern</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Connecting students with the best internship opportunities. Build your career, gain experience, and land your dream job.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-lg transition-all hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 shadow-sm transition-all"
          >
            Log In
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto text-xl font-bold">1</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Profile</h3>
            <p className="text-gray-600">Sign up with your student email and build your professional profile.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto text-xl font-bold">2</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Internships</h3>
            <p className="text-gray-600">Browse through curated internship opportunities matching your skills.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto text-xl font-bold">3</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply & Succeed</h3>
            <p className="text-gray-600">Apply directly and track your application status all in one place.</p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Path2Intern. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
