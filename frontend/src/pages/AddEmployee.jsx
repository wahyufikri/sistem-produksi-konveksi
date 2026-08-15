import EmployeeForm from "../components/EmployeeForm";

function AddEmployee() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      

      <EmployeeForm
        onSuccess={() => {
          alert("Data berhasil ditambahkan");
        }}
      />
    </div>
  );
}

export default AddEmployee;