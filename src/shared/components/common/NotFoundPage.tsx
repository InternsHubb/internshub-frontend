import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/app/routes';
import { cn } from '@/shared/utils/cn';

const PRIMARY_LINK_CLASSES = cn(
  'inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors outline-none',
  'hover:bg-brand focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
);

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-4 text-center">
      <p className="text-sm font-bold tracking-widest text-brand-primary uppercase">404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink">
        {t('common.notFound.title', 'Page not found')}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        {t('common.notFound.description', 'The page you are looking for does not exist or has been moved.')}
      </p>
      <div className="mt-6">
        <Link to={ROUTES.home} className={PRIMARY_LINK_CLASSES}>
          {t('common.notFound.goHome', 'Back to Home')}
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
