import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get("/employees")
      .then(res => setEmployees(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // 🔥 hitung data dari API
  const totalKaryawan = employees.length;

  const totalGaji = employees.reduce((total, item) => {
    return total + Number(item.salary || 0);
  }, 0);

  const totalJabatan = new Set(employees.map(emp => emp.position)).size;

  return (
    <div>

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-red-600">
        <h2 className="text-2xl font-bold text-red-700">
          Dashboard Karyawan
        </h2>
        <p className="text-gray-500 text-sm">
          Ringkasan data perusahaan
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* TOTAL KARYAWAN */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Total Karyawan</p>
          <h3 className="text-2xl font-bold text-red-600">
            {totalKaryawan}
          </h3>
        </div>

        {/* TOTAL GAJI */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Total Gaji</p>
          <h3 className="text-2xl font-bold text-red-600">
            Rp {totalGaji.toLocaleString()}
          </h3>
        </div>

        {/* TOTAL JABATAN */}
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Jumlah Jabatan</p>
          <h3 className="text-2xl font-bold text-red-600">
            {totalJabatan}
          </h3>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;