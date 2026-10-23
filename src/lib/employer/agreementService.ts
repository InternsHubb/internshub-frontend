import { agreementData } from './data';
import type { AgreementParty, AgreementView } from './types';

const delay = (ms = 120) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export async function getAgreement(applicationId: string, signed: boolean): Promise<AgreementView> {
  await delay();
  if (agreementData.applicationId !== applicationId) {
    throw new Error('Agreement not found');
  }

  const parties: AgreementParty[] = [
    agreementData.parties.employer,
    signed ? { ...agreementData.parties.student, status: 'signed' as const } : agreementData.parties.student,
  ];

  return {
    id: agreementData.id,
    applicationId: agreementData.applicationId,
    status: signed ? 'signed' : 'waiting_student',
    parties,
    completedSignatures: parties.filter((party) => party.status === 'signed').length,
  };
}
