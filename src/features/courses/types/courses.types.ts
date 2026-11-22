export type CourseSummaryDto = {
  id: string;
  title: string;
  description?: string | null;
  trackName?: string | null;
  order: number;
  lessonCount: number;
  completedLessonsCount: number | null;
  totalDurationSeconds: number;
};

export type CourseLessonDto = {
  id: string;
  title: string;
  order: number;
  durationSeconds: number;
  isCompleted: boolean;
  playUrl?: string | null;
};

export type CourseDetailDto = CourseSummaryDto & {
  isEntitled?: boolean;
  lessons: CourseLessonDto[];
};

export type CoursePackageDto = {
  id: string;
  code?: string;
  name: string;
  durationMonths: number;
  price: number;
};

export type CourseEnrollmentDto = {
  id: string;
  packageId: string;
  status: 'Active' | 'PendingPayment' | 'Expired' | 'Cancelled' | string;
};

export type PlanChangeQuoteDto = {
  amountDue: number;
  currency?: string;
};

export type CourseInvoiceDto = {
  id: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Cancelled' | string;
};

export type CheckoutSessionDto = {
  invoiceId: string;
  redirectUrl: string;
};
