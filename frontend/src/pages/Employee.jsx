import EmployeeList from "../EmployeeList";

function Dashboard() {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-red-600">
        <h2 className="text-2xl font-bold text-red-700">
          Dashboard Karyawan
        </h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-md">
        <EmployeeList />
      </div>
    </>
  );
}

export default Dashboard;