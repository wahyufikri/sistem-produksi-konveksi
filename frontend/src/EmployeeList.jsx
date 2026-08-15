import { useState, useEffect } from "react";
import api from "./services/api";
import { Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EmployeeList({ refresh, onEdit, onAdd }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/employees")
      .then(res => setData(res.data.data))
      .catch(err => console.error(err));
  }, [refresh]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin mau hapus data ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/employees/${id}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      {/* HEADER + BUTTON */}
      <div className="flex items-center justify-between mb-4">

        <h3 className="text-xl font-bold text-red-600">
          Data Karyawan
        </h3>

        <Link
  to="/add"
  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition inline-block"
>
  + Tambah Karyawan
</Link>

      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left">

          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Posisi</th>
              <th className="p-3">Gaji</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.map((emp, index) => (
              <tr
                key={emp.id}
                className={`
                  border-b 
                  hover:bg-red-50 
                  transition
                  ${index % 2 === 0 ? "bg-gray-50" : ""}
                `}
              >

                <td className="p-3 font-medium text-gray-800">
                  {emp.name}
                </td>

                <td className="p-3 text-gray-600">
                  {emp.position}
                </td>

                <td className="p-3 text-red-600 font-semibold">
                  Rp {Number(emp.salary).toLocaleString()}
                </td>

                <td className="p-3 flex gap-3">

                  <button
    onClick={() => navigate(`/employee/edit/${emp.id}`)}
    className="text-blue-600 hover:text-blue-800"
  >
    <Pencil size={18} />
  </button>

                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash size={18} />
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default EmployeeList;