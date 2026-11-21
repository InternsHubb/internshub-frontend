import { StudentLayout } from '@/shared/layouts';
import { CompositeScoreCard } from '@/shared/components/common/CompositeScoreCard';
import { RecruitmentTopBar } from '@/features/recruitment/components/student/RecruitmentTopBar';
import { CURRENT_APPLICANT } from '@/features/recruitment/data/student/recruitmentData';

export function RecruitmentStudentShell() {
  return (
    <StudentLayout
      topbar={<RecruitmentTopBar />}
      sidebarFooter={<CompositeScoreCard score={CURRENT_APPLICANT.compositeScore} />}
    />
  );
}

export default RecruitmentStudentShell;
