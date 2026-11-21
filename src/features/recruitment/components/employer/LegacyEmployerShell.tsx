import { Outlet } from 'react-router-dom';
import LegacyEmployerSidebar from '@/features/recruitment/components/employer/LegacyEmployerSidebar';
import EmployerHeader from '@/features/recruitment/components/employer/EmployerHeader';

export function LegacyEmployerShell() {
  return (
    <div className="min-h-screen bg-[#FDFBFF] font-sans text-slate-900">
      <LegacyEmployerSidebar />
      <div className="flex min-h-screen flex-col lg:pl-[266px]">
        <EmployerHeader />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 pb-12 pt-2 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LegacyEmployerShell;
