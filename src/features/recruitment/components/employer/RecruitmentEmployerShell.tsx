import { EmployerLayout } from '@/shared/layouts';
import { EmployerSidebar } from '@/features/recruitment/components/employer/EmployerSidebar';
import { EmployerTopbar } from '@/features/recruitment/components/employer/EmployerTopbar';

export function RecruitmentEmployerShell() {
  return (
    <EmployerLayout
      renderSidebar={({ mobileOpen, onClose }) => (
        <EmployerSidebar mobileOpen={mobileOpen} onClose={onClose} />
      )}
      renderTopbar={({ onOpenMobileMenu }) => (
        <EmployerTopbar onOpenMobileMenu={onOpenMobileMenu} />
      )}
    />
  );
}

export default RecruitmentEmployerShell;
