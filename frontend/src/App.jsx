import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductionList from "./pages/production/ProductionList";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import CustomerList from "./pages/customers/CustomerList";
import CustomerCreate from "./pages/customers/CustomerCreate";
import CustomerEdit from "./pages/customers/CustomerEdit";
import CustomerDetail from "./pages/customers/CustomerDetail";
import ProductList from "./pages/products/ProductList";
import ProductCreate from "./pages/products/ProductCreate";
import ProductEdit from "./pages/products/ProductEdit";
import ProductDetail from "./pages/products/ProductDetail";
import OrderList from "./pages/orders/OrderList";
import OrderCreate from "./pages/orders/OrderCreate";
import OrderDetail from "./pages/orders/OrderDetail";
import OrderEdit from "./pages/orders/OrderEdit";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* DASHBOARD ADMIN */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <RoleRoute role="admin">
                                <DashboardLayout>
                                    <Dashboard />
                                </DashboardLayout>
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* PRODUCTION */}
                <Route
                    path="/production"
                    element={
                        <ProtectedRoute>
                            <RoleRoute role="production">
                                <DashboardLayout>
                                    <ProductionList />
                                </DashboardLayout>
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* DEFAULT */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />
                {/* CUSTOMER */}
<Route
    path="/customers"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <CustomerList />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/customers/create"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <CustomerCreate />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/customers/:id"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <CustomerDetail />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/customers/:id/edit"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <CustomerEdit />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>
{/* PRODUCTS */}

<Route
    path="/products"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <ProductList />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/products/create"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <ProductCreate />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/products/:id"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <ProductDetail />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/products/:id/edit"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <ProductEdit />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>
<Route
    path="/orders"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <OrderList />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>
<Route
    path="/orders/create"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <OrderCreate />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>
<Route
    path="/orders/:id"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <OrderDetail />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>
<Route
    path="/orders/:id/edit"
    element={
        <ProtectedRoute>
            <RoleRoute role="admin">
                <DashboardLayout>
                    <OrderEdit />
                </DashboardLayout>
            </RoleRoute>
        </ProtectedRoute>
    }
/>


            </Routes>
        </BrowserRouter>
    );
}

export default App;