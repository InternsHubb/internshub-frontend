import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import {
  LANDING_INTERNSHIPS,
  getInternshipById,
} from '@/data/landingInternshipsData';
import { ROUTES, internshipDetailsPath } from '@/constants/routes';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Clock,
  BadgeDollarSign,
  GraduationCap,
  Users,
  CheckCircle2,
  Layers,
  Award,
  AlertCircle,
  Briefcase,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';

// Import AI Photography Work Header Images
import frontendWorkImg from '@/assets/images/internships/frontend_work.jpg';
import uiuxWorkImg from '@/assets/images/internships/uiux_work.jpg';
import backendWorkImg from '@/assets/images/internships/backend_work.jpg';
import dataWorkImg from '@/assets/images/internships/data_work.jpg';

const CATEGORY_WORK_IMAGES: Record<string, string> = {
  frontend: frontendWorkImg,
  design: uiuxWorkImg,
  backend: backendWorkImg,
  data: dataWorkImg,
  mobile: frontendWorkImg,
};

export const InternshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const opportunity = useMemo(() => {
    return id ? getInternshipById(id) : undefined;
  }, [id]);

  const otherOpportunities = useMemo(() => {
    return LANDING_INTERNSHIPS.filter((opp) => opp.id !== id);
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Not Found State
  if (!opportunity) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col">
        <Navbar activeSection="internship" sectionLinkBase={ROUTES.home} />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="size-16 rounded-full bg-purple-50 text-[#5a198f] flex items-center justify-center mx-auto mb-4">
              <Briefcase className="size-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isRtl ? 'لم يتم العثور على الفرصة التدريبية' : 'Internship Opportunity Not Found'}
            </h1>
            <p className="text-slate-600 mb-6 text-[14px]">
              {isRtl
                ? 'الفرصة التدريبية المطلوبة غير متوفرة أو ربما تم تغيير مسارها.'
                : 'The internship opportunity you are looking for does not exist or has been moved.'}
            </p>
            <Link
              to={`${ROUTES.home}#internship`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5a198f] text-white font-semibold hover:bg-[#3a0353] transition-colors"
            >
              {isRtl ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
              <span>{isRtl ? 'العودة لفرص التدريب' : 'Back to Internships'}</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const workPhoto = CATEGORY_WORK_IMAGES[opportunity.category] || frontendWorkImg;

  return (
    <div className="min-h-screen bg-[#faf7fc] text-slate-900 flex flex-col selection:bg-purple-200 selection:text-purple-950">
      <Navbar activeSection="internship" sectionLinkBase={ROUTES.home} />

      <main className="flex-grow max-w-[1240px] xl:max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb Navigation & Share Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to={`${ROUTES.home}#internship`}
            className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#5a198f] hover:text-[#3a0353] transition-colors group"
          >
            {isRtl ? (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            )}
            <span>{isRtl ? 'العودة لجميع الفرص التدريبية' : 'Back to All Internship Opportunities'}</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-[#5a198f] border border-purple-100/80 text-[12.5px] font-medium transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5" />}
            <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : isRtl ? 'مشاركة الفرصة' : 'Share Opportunity'}</span>
          </button>
        </div>

        {/* HERO BANNER: Full-Width Human-Work Photograph + Title + Meta */}
        <div className="w-full bg-white rounded-3xl border border-[#e8e2f0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden mb-8">
          <div className="w-full h-56 sm:h-72 md:h-80 relative overflow-hidden bg-slate-900">
            <img
              src={workPhoto}
              alt={isRtl ? opportunity.titleAr : opportunity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

            {/* Floating Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-white/95 text-[#5a198f] shadow-md backdrop-blur-xs">
                {isRtl ? opportunity.categoryLabelAr : opportunity.categoryLabel}
              </span>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11.5px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                  {isRtl ? opportunity.workModeAr : opportunity.workMode}
                </span>
                <span className="px-3 py-1 rounded-full text-[11.5px] font-bold bg-white/90 text-slate-900 shadow-sm">
                  {isRtl ? opportunity.durationAr : opportunity.duration}
                </span>
              </div>
            </div>

            {/* Bottom Floating Title & Company Info */}
            <div className="absolute bottom-5 inset-x-5 sm:bottom-6 sm:inset-x-8 text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-2">
                {isRtl ? opportunity.titleAr : opportunity.title}
              </h1>

              <div className="flex items-center flex-wrap gap-3 text-[13px] sm:text-[14px] text-white/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-4 text-purple-300" />
                  <span>{isRtl ? opportunity.companyAr : opportunity.company}</span>
                </span>
                <span className="text-white/50">&bull;</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-purple-300" />
                  <span>{isRtl ? opportunity.locationAr : opportunity.location}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Comprehensive Internship Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview & Squad Scope Card */}
            <div className="bg-white rounded-3xl border border-[#e8e2f0] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[14px] font-bold text-[#5a198f] uppercase tracking-wide mb-3">
                <Users className="size-4.5 text-[#5a198f]" />
                <h2>{isRtl ? 'الفريق ونطاق العمل' : 'Team & Squad Scope'}</h2>
              </div>

              <h3 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-2">
                {isRtl ? opportunity.overview.teamAr : opportunity.overview.team}
              </h3>

              <p className="text-[14.5px] text-slate-700 leading-relaxed mb-4">
                {isRtl ? opportunity.overview.projectScopeAr : opportunity.overview.projectScope}
              </p>

              <p className="text-[14px] text-slate-600 leading-relaxed">
                {isRtl ? opportunity.shortDescriptionAr : opportunity.shortDescription}
              </p>
            </div>

            {/* Key Responsibilities Card */}
            <div className="bg-white rounded-3xl border border-[#e8e2f0] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[14px] font-bold text-[#5a198f] uppercase tracking-wide mb-4">
                <CheckCircle2 className="size-4.5 text-[#5a198f]" />
                <h2>{isRtl ? 'المهام والمسؤوليات الرئيسية' : 'Key Responsibilities'}</h2>
              </div>

              <ul className="space-y-3">
                {(isRtl ? opportunity.responsibilitiesAr : opportunity.responsibilities).map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 leading-relaxed font-medium">
                    <span className="size-2 rounded-full bg-[#5a198f] shrink-0 mt-2" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements & Qualifications Card */}
            <div className="bg-white rounded-3xl border border-[#e8e2f0] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[14px] font-bold text-[#dc6e0d] uppercase tracking-wide mb-4">
                <Layers className="size-4.5 text-[#dc6e0d]" />
                <h2>{isRtl ? 'المتطلبات والمؤهلات المطلوبة' : 'Requirements & Qualifications'}</h2>
              </div>

              <ul className="space-y-3">
                {(isRtl ? opportunity.requirementsAr : opportunity.requirements).map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 leading-relaxed font-medium">
                    <span className="size-2 rounded-full bg-[#dc6e0d] shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Learning Outcomes Card */}
            <div className="bg-white rounded-3xl border border-[#e8e2f0] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-[14px] font-bold text-emerald-700 uppercase tracking-wide mb-4">
                <Award className="size-4.5 text-emerald-600" />
                <h2>{isRtl ? 'المخرجات التعليمية والمهارات المكتسبة' : 'Practical Learning Outcomes'}</h2>
              </div>

              <ul className="space-y-3">
                {(isRtl ? opportunity.learningOutcomesAr : opportunity.learningOutcomes).map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-slate-700 leading-relaxed font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-1" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authentic Workplace Simulation Notice */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3.5 text-[13px] text-amber-950 leading-relaxed">
              <AlertCircle className="size-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">
                  {isRtl ? 'حول برنامج التدريب في InternsHub:' : 'About InternsHub Simulated Sprints:'}
                </span>
                <span>
                  {isRtl
                    ? 'هذه فرصة تدريبية حقيقية مطبقة ضمن فرق عمل وسكوادات متكاملة بمتابعة مهندسين خبراء، تمنحك الخبرة العملية المطلوبة لسوق العمل دون الحاجة لسنوات خبرة سابقة.'
                    : 'This is an authentic simulated workplace sprint built directly into InternsHub, pairing you with senior engineering mentors to build production-grade features that prepare you for top tech employment.'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Sidebar Summary & Apply Card */}
          <div className="space-y-6">
            {/* Quick Facts Card */}
            <div className="bg-white rounded-3xl border border-[#e8e2f0] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sticky top-28">
              <h3 className="text-[17px] font-extrabold text-slate-900 mb-5 pb-3 border-b border-purple-50">
                {isRtl ? 'ملخص الفرصة التدريبية' : 'Opportunity Summary'}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock className="size-4 text-[#5a198f]" />
                    <span>{isRtl ? 'مدة البرنامج' : 'Duration'}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {isRtl ? opportunity.durationAr : opportunity.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Building2 className="size-4 text-[#5a198f]" />
                    <span>{isRtl ? 'نمط العمل' : 'Work Mode'}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {isRtl ? opportunity.workModeAr : opportunity.workMode}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <MapPin className="size-4 text-[#5a198f]" />
                    <span>{isRtl ? 'الموقع' : 'Location'}</span>
                  </span>
                  <span className="font-bold text-slate-900 truncate max-w-[150px]">
                    {isRtl ? opportunity.locationAr : opportunity.location}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <GraduationCap className="size-4 text-[#5a198f]" />
                    <span>{isRtl ? 'المستوى' : 'Level'}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {isRtl ? opportunity.levelAr : opportunity.level}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <BadgeDollarSign className="size-4 text-emerald-600" />
                    <span>{isRtl ? 'المكافأة' : 'Stipend'}</span>
                  </span>
                  <span className="font-bold text-emerald-700">
                    {isRtl ? opportunity.compensationAr : opportunity.compensation}
                  </span>
                </div>
              </div>

              {/* Skills Section */}
              <div className="pt-4 border-t border-purple-50 mb-6">
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                  {isRtl ? 'المهارات والتقنيات المطلوبة' : 'Skills & Technologies'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-[11.5px] font-semibold rounded-lg bg-[#faf7fd] text-[#5a198f] border border-purple-100/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply CTA Button */}
              <Link
                to={ROUTES.register}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#5a198f] hover:bg-[#3a0353] text-white text-[14px] font-bold shadow-md shadow-[#5a198f]/25 transition-all duration-200 active:scale-98"
              >
                <span>{isRtl ? 'التقديم على هذا التدريب' : 'Apply for This Internship'}</span>
                {isRtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              </Link>

              <div className="text-center mt-3">
                <span className="text-[11.5px] text-slate-400 font-medium">
                  {isRtl ? 'لا يشترط وجود خبرة سابقة للتقديم' : 'No prior commercial experience required'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Explore Other Available Tracks */}
        {otherOpportunities.length > 0 && (
          <section className="mt-16 pt-12 border-t border-purple-200/70">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-purple-100/70 text-[#5a198f] mb-2">
                  <Sparkles className="size-3.5 text-[#dc6e0d]" />
                  <span>{isRtl ? 'مسارات إضافية' : 'More Tracks Available'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                  {isRtl ? 'استكشف فرص تدريبية أخرى' : 'Explore Other Internship Opportunities'}
                </h3>
              </div>

              <Link
                to={`${ROUTES.home}#internship`}
                className="hidden sm:inline-flex items-center gap-2 text-[14px] font-bold text-[#5a198f] hover:underline"
              >
                <span>{isRtl ? 'عرض كل الفرص' : 'View All Opportunities'}</span>
                {isRtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherOpportunities.slice(0, 3).map((other) => {
                const otherPhoto = CATEGORY_WORK_IMAGES[other.category] || frontendWorkImg;
                return (
                  <div
                    key={other.id}
                    className="bg-white rounded-3xl border border-[#e8e2f0] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="w-full h-36 rounded-2xl overflow-hidden mb-3 relative bg-slate-900">
                        <img src={otherPhoto} alt={other.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-[#5a198f]">
                          {isRtl ? other.categoryLabelAr : other.categoryLabel}
                        </span>
                      </div>
                      <h4 className="text-[16px] font-bold text-slate-900 mb-1 leading-snug">
                        {isRtl ? other.titleAr : other.title}
                      </h4>
                      <p className="text-[12.5px] text-slate-600 line-clamp-2 mb-3">
                        {isRtl ? other.shortDescriptionAr : other.shortDescription}
                      </p>
                    </div>

                    <Link
                      to={internshipDetailsPath(other.id)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-purple-50 hover:bg-[#5a198f] text-[#5a198f] hover:text-white text-[12.5px] font-bold transition-colors"
                    >
                      <span>{isRtl ? 'عرض التفاصيل' : 'More Details'}</span>
                      {isRtl ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InternshipDetailsPage;
