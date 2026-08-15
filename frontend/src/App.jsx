import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import AddEmployee from "./pages/AddEmployee";
import Employee from "./pages/Employee";
import EditEmployee from "./pages/EditEmployee";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🔥 Layout jadi parent */}
        <Route path="/" element={<Layout />}>

          {/* child routes */}
          <Route index element={<Dashboard />} />
          <Route path="employee" element={<Employee />} />
          <Route path="employee/create" element={<AddEmployee />} />
          <Route path="employee/edit/:id" element={<EditEmployee />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;