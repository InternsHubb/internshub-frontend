
import { Outlet, useLocation } from 'react-router-dom';
import EmployerSidebar from '@/components/employer/legacy/EmployerSidebar';
import EmployerHeader from '@/components/employer/EmployerHeader';

// Layout of the legacy employer prototype (PR #30), mounted as LegacyEmployerLayout for its
// /employer sub-paths in src/app/router.tsx (no sign-in). Not the PR #32 layout, which is
// components/employer/EmployerLayout.tsx. It uses the legacy sidebar and the PR #30
// EmployerHeader; page data comes from constants in components/employer/employerData.tsx.

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
