import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex h-screen bg-red-50">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-red-700 to-red-900 text-white p-5 shadow-xl">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <ul className="space-y-3 text-sm">

          <li>
            <Link to="/" className="block hover:bg-red-600 px-3 py-2 rounded">
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/employee" className="block hover:bg-red-600 px-3 py-2 rounded">
              Data Karyawan
            </Link>
          </li>

        </ul>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* 🔥 INI KUNCINYA */}
      </div>

    </div>
  );
}

export default Layout;