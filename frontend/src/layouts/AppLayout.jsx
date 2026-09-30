import { Outlet } from "react-router-dom";

import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopbar from "../components/dashboard/DashboardTopbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Dashboard Sidebar */}
      <DashboardSidebar />

      {/* Main Application Area */}
      <div className="min-h-screen lg:pl-[250px]">
        {/* Dashboard Topbar */}
        <DashboardTopbar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-72px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;