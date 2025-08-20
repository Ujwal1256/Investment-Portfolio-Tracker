import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to <span className="text-indigo-600">Investment Portfolio Tracker</span>
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Manage your <span className="font-semibold">stocks</span>, <span className="font-semibold">crypto</span>, and <span className="font-semibold">bonds</span> in one place 🚀
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}
