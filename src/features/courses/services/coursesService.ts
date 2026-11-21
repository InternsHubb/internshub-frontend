import { notConnected } from '@/backend';
import type {
  CheckoutSessionDto,
  CourseDetailDto,
  CourseEnrollmentDto,
  CourseInvoiceDto,
  CoursePackageDto,
  CourseSummaryDto,
  PlanChangeQuoteDto,
} from '@/features/courses/types/courses.types';

export async function getCourses(): Promise<CourseSummaryDto[]> {
  return notConnected('courses', 'getCourses');
}

export async function getCourseById(_id: string): Promise<CourseDetailDto> {
  return notConnected('courses', 'getCourseById');
}

export async function completeLesson(_courseId: string, _lessonId: string): Promise<void> {
  return notConnected('courses', 'completeLesson');
}

export async function getPackages(): Promise<CoursePackageDto[]> {
  return notConnected('courses', 'getPackages');
}

export async function getMyEnrollments(): Promise<CourseEnrollmentDto[]> {
  return notConnected('courses', 'getMyEnrollments');
}

export async function getUpgradeQuote(_enrollmentId: string, _targetPackageId: string): Promise<PlanChangeQuoteDto> {
  return notConnected('courses', 'getUpgradeQuote');
}

export async function requestUpgrade(_enrollmentId: string, _targetPackageId: string): Promise<CourseEnrollmentDto> {
  return notConnected('courses', 'requestUpgrade');
}

export async function checkoutEnrollment(_enrollmentId: string): Promise<CheckoutSessionDto> {
  return notConnected('courses', 'checkoutEnrollment');
}

export async function getMyInvoices(): Promise<CourseInvoiceDto[]> {
  return notConnected('courses', 'getMyInvoices');
}
