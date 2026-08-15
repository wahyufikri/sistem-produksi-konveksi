import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔥 ambil id dari URL

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    salary: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔥 ambil data kalau mode edit
  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        try {
          const res = await api.get(`/employees/${id}`);
          console.log(res.data);
          setForm(res.data.data);
        } catch (error) {
          console.error(error);
          alert("Gagal mengambil data karyawan");
        }
      };

      fetchEmployee();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        // 🔥 UPDATE
        await api.put(`/employees/${id}`, form);
        alert("Data berhasil diupdate");
      } else {
        // 🔥 CREATE
        await api.post("/employees", form);
        alert("Data berhasil ditambahkan");
      }

      // reset form (optional)
      setForm({
        name: "",
        email: "",
        position: "",
        salary: ""
      });

      navigate("/employee");

    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-red-700 mb-4">
        {id ? "Edit Karyawan" : "Tambah Karyawan"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-white px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-white px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
        />

        <input
          type="text"
          name="position"
          placeholder="Jabatan"
          value={form.position}
          onChange={handleChange}
          className="w-full bg-white px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
        />

        <input
          type="number"
          name="salary"
          placeholder="Gaji"
          value={form.salary}
          onChange={handleChange}
          className="w-full bg-white px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
        >
          {loading
            ? "Menyimpan..."
            : id
            ? "Update Karyawan"
            : "Tambah Karyawan"}
        </button>

      </form>
    </div>
  );
}

export default EmployeeForm;