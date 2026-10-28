import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { SeniorJourneyView } from '@/components/experience/SeniorJourneyView';
import { SeniorCard } from '@/components/experience/SeniorCard';
import { getSeniorById, getAllSeniors } from '@/data/seniorsData';
import { ROUTES } from '@/constants/routes';
import { ArrowLeft, ArrowRight, UserX, Sparkles } from 'lucide-react';

export const SeniorJourneyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const senior = useMemo(() => {
    return id ? getSeniorById(id) : undefined;
  }, [id]);

  const allSeniors = useMemo(() => getAllSeniors(), []);
  const otherSeniors = useMemo(() => {
    return allSeniors.filter((s) => s.id !== id);
  }, [allSeniors, id]);

  if (!senior) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col">
        <Navbar activeSection="home" sectionLinkBase={ROUTES.home} />
        <main className="flex-grow flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center">
            <div className="size-16 rounded-full bg-purple-50 text-[#5a198f] flex items-center justify-center mx-auto mb-4">
              <UserX className="size-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isRtl ? 'لم يتم العثور على المسيرة المهنية' : 'Career Journey Not Found'}
            </h1>
            <p className="text-slate-600 mb-6 text-[14px]">
              {isRtl
                ? 'الملف الشخصي المطلوب غير متوفر أو ربما تم تغييره.'
                : 'The senior profile you are looking for does not exist or has been moved.'}
            </p>
            <Link
              to={`${ROUTES.home}#internship`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5a198f] text-white font-semibold hover:bg-[#3a0353] transition-colors"
            >
              {isRtl ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
              <span>{t('experience.backToSeniors')}</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7fc] text-slate-900 flex flex-col selection:bg-purple-200 selection:text-purple-950">
      <Navbar activeSection="home" sectionLinkBase={ROUTES.home} />

      <main className="flex-grow max-w-[1240px] xl:max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Journey View */}
        <SeniorJourneyView senior={senior} showBackNavigation={true} isModal={false} />

        {/* Explore Other Senior Journeys Carousel / Grid */}
        {otherSeniors.length > 0 && (
          <section className="mt-16 pt-12 border-t border-purple-200/70">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-purple-100/70 text-[#5a198f] mb-2">
                  <Sparkles className="size-3.5 text-[#dc6e0d]" />
                  <span>{isRtl ? 'المزيد من المسيرات الملهمة' : 'More Inspiring Journeys'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                  {isRtl ? 'استكشف مسارات مهنية أخرى' : 'Explore Other Senior Journeys'}
                </h3>
              </div>
              <Link
                to={`${ROUTES.home}#internship`}
                className="hidden sm:inline-flex items-center gap-2 text-[14px] font-semibold text-[#5a198f] hover:underline"
              >
                <span>{t('experience.backToSeniors')}</span>
                {isRtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherSeniors.slice(0, 3).map((other) => (
                <SeniorCard
                  key={other.id}
                  senior={other}
                  journeyHref={`/seniors/${other.id}`}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SeniorJourneyPage;
