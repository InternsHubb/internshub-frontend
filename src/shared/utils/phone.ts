const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

/**
 * Normalizes a country calling code and local phone number to E.164 format (+201001234567).
 */
export function toInternationalPhone(countryCode: string, localNumber: string): string | null {
  const digits = localNumber.replace(/\D/g, '').replace(/^0+/, '');
  const value = `${countryCode}${digits}`;
  return E164_PATTERN.test(value) ? value : null;
}

export function maskPhoneNumber(phone: string): string {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 4)}••••${phone.slice(-3)}`;
}
