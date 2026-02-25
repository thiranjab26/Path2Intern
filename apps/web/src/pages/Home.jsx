import { Link } from "react-router-dom";

export default function Home() {
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
