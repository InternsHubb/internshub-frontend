export type EmployerProfile = {
  id: string;
  companyName: string;
  companyInitials: string;
  viewerName: string;
  viewerInitials: string;
  viewerRole: string;
  online: boolean;
};

export type Candidate = {
  id: string;
  name: string;
  initials: string;
  matchPercent: number;
  cohort: number;
};

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  typeKey: 'internship';
  modeKey: 'hybrid';
  durationMonths: number;
  startDate: string;
};

export type PipelineStage = 'all' | 'applied' | 'screening' | 'interview' | 'decision' | 'agreement';
export type PipelineRecordStage = Exclude<PipelineStage, 'all'>;

export type PipelineFilter = {
  id: PipelineStage;
  count: number;
};

export type InterviewStatus = 'scheduled';

export type PipelineInterview = {
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  mode: string;
  status: InterviewStatus;
};

export type PipelineRecord = {
  id: string;
  candidateId: string;
  opportunityId: string;
  stage: PipelineRecordStage;
  interview: PipelineInterview | null;
};

export type PipelineRecordView = {
  id: string;
  candidate: Candidate;
  opportunity: Opportunity;
  stage: PipelineRecordStage;
  interview: PipelineInterview | null;
};

export type PipelineData = {
  filters: PipelineFilter[];
  records: PipelineRecord[];
};

export type PipelineView = {
  filters: PipelineFilter[];
  records: PipelineRecordView[];
};

export type InterviewDetails = {
  applicationId: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  duration: string;
  mode: string;
  interviewer: string;
  meetingLink: string;
  notes: string;
  status: InterviewStatus;
};

export type InterviewFormValues = Pick<
  InterviewDetails,
  'date' | 'startTime' | 'timezone' | 'duration' | 'mode' | 'interviewer' | 'meetingLink' | 'notes'
>;

export type DecisionOutcome = 'select' | 'reject';
export type DecisionStatus = 'draft' | 'submitted';

export type EmployerDecision = {
  applicationId: string;
  outcome: DecisionOutcome;
  reason: string;
  status: DecisionStatus;
};

export type AgreementPartyKind = 'employer' | 'student';
export type AgreementPartyStatus = 'signed' | 'pending';

export type AgreementParty = {
  id: string;
  kind: AgreementPartyKind;
  name: string;
  signedBy?: string;
  status: AgreementPartyStatus;
};

export type AgreementRecord = {
  id: string;
  applicationId: string;
  parties: {
    employer: AgreementParty;
    student: AgreementParty;
  };
};

export type AgreementView = {
  id: string;
  applicationId: string;
  status: 'waiting_student' | 'signed';
  parties: AgreementParty[];
  completedSignatures: number;
};

export type CompletionRecord = {
  id: string;
  candidateId: string;
  opportunityId: string;
  employer: string;
  role: string;
  durationMonths: number;
  statusKey: 'confirmed';
};

export type CompletionData = {
  summaryLabels: Array<'confirmed' | 'pending' | 'shown'>;
  record: CompletionRecord;
  footer: string;
};

export type CompletionView = {
  summaryLabels: CompletionData['summaryLabels'];
  record: {
    id: string;
    candidate: Candidate;
    employer: string;
    role: string;
    durationMonths: number;
  };
  footer: string;
};
