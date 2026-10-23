
import { Outlet, useLocation } from 'react-router-dom';
import EmployerSidebar from '@/components/employer/EmployerSidebar';
import EmployerHeader from '@/components/employer/EmployerHeader';

export default function EmployerLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <EmployerSidebar />

      <div className="min-h-screen lg:pl-[250px]">
        <EmployerHeader />

        <main
          key={location.pathname}
          className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
