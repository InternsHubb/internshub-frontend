import type {
  BilingualText,
  NavigationItem,
  RecruitmentProfile,
} from "@/features/recruitment/types/studentRecruitment";

export const profile: RecruitmentProfile = {
  name: "Merna Adel",
  title: "UI/UX Designer",
  initials: "MA",
  score: 87,
  percentile: 15,
  visibleToEmployers: true,
  primaryTrack: "Internship",
  cohort: "Cohort 12 · 2024",
  mentor: "Ahmed Khaled",
  certificates: [
    "UI/UX Design Fundamentals",
    "React Advanced Patterns",
    "Figma Mastery",
  ],
  skills: [
    "UI/UX Design",
    "Design Thinking",
    "Usability Testing",
    "Figma",
    "User Research",
    "Wireframing",
    "Prototyping",
    "HTML/CSS",
    "Interaction Design",
    "Design Systems",
  ],
  about: {
    en: "UI/UX Designer passionate about creating user-centered digital experiences. Completed an internship at DesignCraft Agency where I led the redesign of their client’s checkout flow, reducing cart abandonment by 32%. Certified in UI/UX Design, React, and Figma through InternsHub.",
    ar: "مصممة UI/UX شغوفة بإنشاء تجارب رقمية تتمحور حول المستخدم. أكملت تدريبًا في DesignCraft Agency وقُدت إعادة تصميم تجربة الدفع، مما ساهم في تقليل ترك سلة التسوق بنسبة 32%. حاصلة على شهادات في UI/UX Design وReact وFigma من InternsHub. (الترجمة تحتاج مراجعة)",
  },
};

export const navigationItems: NavigationItem[] = [
  { id: "dashboard", label: { en: "Dashboard", ar: "لوحة التحكم" } },
  { id: "eligibility", label: { en: "Eligibility", ar: "الأهلية" } },
  { id: "profile", label: { en: "Talent Profile", ar: "الملف المهني" } },
  {
    id: "opportunities",
    label: { en: "Opportunities", ar: "الفرص" },
    count: 4,
  },
  {
    id: "applications",
    label: { en: "My Applications", ar: "طلباتي" },
  },
  { id: "interview", label: { en: "Interview", ar: "المقابلة" }, count: 1 },
  { id: "agreement", label: { en: "Agreement", ar: "الاتفاقية" } },
  {
    id: "notifications",
    label: { en: "Notifications", ar: "الإشعارات" },
    count: 2,
  },
];

export const dashboardCopy: Record<string, BilingualText> = {
  title: { en: "Recruitment", ar: "التوظيف" },
  subtitle: {
    en: "Turn your InternsHub experience into your next opportunity.",
    ar: "حوّل تجربتك في InternsHub إلى فرصتك القادمة. (الترجمة تحتاج مراجعة)",
  },
  visibleTitle: {
    en: "Your profile is live and visible to employers",
    ar: "ملفك ظاهر الآن لأصحاب العمل. (الترجمة تحتاج مراجعة)",
  },
  visibleDescription: {
    en: "You've exceeded the 80% threshold. Employers can now discover, view, and reach out to you directly.",
    ar: "تجاوزت الحد المطلوب وهو 80٪. يمكن لأصحاب العمل الآن اكتشاف ملفك والتواصل معك مباشرة. (الترجمة تحتاج مراجعة)",
  },
  score: { en: "Composite Score", ar: "النتيجة الإجمالية" },
  certificates: { en: "Certificates", ar: "الشهادات" },
  opportunities: { en: "Open Opportunities", ar: "الفرص المتاحة" },
  quickActions: { en: "Quick Actions", ar: "إجراءات سريعة" },
  recentActivity: { en: "Recent Activity", ar: "النشاط الأخير" },
  recommended: {
    en: "Recommended Opportunities",
    ar: "فرص مقترحة",
  },
};

export const eligibilityCopy: Record<string, BilingualText> = {
  title: { en: "Recruitment Eligibility", ar: "أهلية التوظيف" },
  subtitle: {
    en: "Your score breakdown and employer visibility status.",
    ar: "تفاصيل نتيجتك وحالة ظهور ملفك لأصحاب العمل. (الترجمة تحتاج مراجعة)",
  },
  breakdown: { en: "Score Breakdown", ar: "تفاصيل النتيجة" },
  eligible: { en: "You're eligible", ar: "أنت مؤهل" },
  visibleTitle: {
    en: "Your profile is visible to employers",
    ar: "ملفك ظاهر لأصحاب العمل",
  },
  scoreLine: {
    en: "Score: 87% · Required: 80% · Exceeded by +7%",
    ar: "النتيجة: 87٪ · المطلوب: 80٪ · تجاوزت المطلوب بـ7٪",
  },
  description: {
    en: "Your Talent Profile is now discoverable in the employer directory. Keep your profile updated to attract the best opportunities.",
    ar: "يمكن الآن العثور على ملفك في دليل أصحاب العمل. حدّث ملفك باستمرار للوصول إلى أفضل الفرص. (الترجمة تحتاج مراجعة)",
  },
  viewProfile: { en: "View My Talent Profile", ar: "عرض ملفي المهني" },
  browse: { en: "Browse Opportunities", ar: "تصفّح الفرص" },
};

export const scoreCategories: Array<{
  label: BilingualText;
  score: number;
}> = [
  { label: { en: "Technical Skills", ar: "المهارات التقنية" }, score: 90 },
  {
    label: { en: "Internship Performance", ar: "أداء التدريب" },
    score: 85,
  },
  {
    label: { en: "Course Performance", ar: "أداء الدورات" },
    score: 88,
  },
  { label: { en: "Mentorship", ar: "الإرشاد" }, score: 86 },
];

export const profileCopy: Record<string, BilingualText> = {
  title: { en: "Talent Profile", ar: "الملف المهني" },
  subtitle: {
    en: "This is what employers see when they discover you.",
    ar: "هذا ما يراه أصحاب العمل عند اكتشاف ملفك. (الترجمة تحتاج مراجعة)",
  },
  visible: {
    en: "Profile Visibility: Visible to employers",
    ar: "ظهور الملف: ظاهر لأصحاب العمل",
  },
  available: {
    en: "Available for opportunities",
    ar: "متاحة للفرص",
  },
  about: { en: "About", ar: "نبذة" },
  skills: { en: "Skills", ar: "المهارات" },
  experience: {
    en: "Internship Experience",
    ar: "خبرة التدريب",
  },
  projects: { en: "Projects", ar: "المشاريع" },
  certificates: { en: "Certificates", ar: "الشهادات" },
  edit: { en: "Edit Profile", ar: "تعديل الملف" },
  preview: { en: "Preview", ar: "معاينة" },
};

export const experienceDescription: BilingualText = {
  en: "Led redesign of e-commerce checkout flows. Reduced cart abandonment by 32%. Delivered 3 client projects.",
  ar: "قُدت إعادة تصميم خطوات الدفع في متجر إلكتروني. ساهمت في تقليل ترك سلة التسوق بنسبة 32٪، وأنجزت 3 مشاريع للعملاء. (الترجمة تحتاج مراجعة)",
};

export const projectDescriptions: Array<{
  title: string;
  description: BilingualText;
  tags: string[];
}> = [
  {
    title: "E-Commerce Checkout Redesign",
    description: {
      en: "Led end-to-end redesign of checkout flow for a fashion retailer — reduced cart abandonment by 32% post-launch.",
      ar: "قُدت إعادة تصميم تجربة الدفع بالكامل لمتجر أزياء، مما ساهم في تقليل ترك سلة التسوق بنسبة 32٪ بعد الإطلاق. (الترجمة تحتاج مراجعة)",
    },
    tags: ["Figma", "User Testing", "UX Writing"],
  },
  {
    title: "FinTech Personal Dashboard",
    description: {
      en: "Designed an analytics-heavy personal finance tracking app from discovery to handoff, with a custom data visualization system.",
      ar: "صممت تطبيقًا لمتابعة الشؤون المالية الشخصية، من مرحلة البحث حتى التسليم، مع نظام مخصص لعرض البيانات. (الترجمة تحتاج مراجعة)",
    },
    tags: ["Prototyping", "Data Viz", "Design System"],
  },
];
