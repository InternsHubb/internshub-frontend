const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockResetError extends Error {
  code: "invalid_code" | "server";
  constructor(code: "invalid_code" | "server") {
    super(code);
    this.code = code;
  }
}

// للتجربة: الكود الصح "123456"، أي كود تاني = خطأ.
export async function verifyResetCode(_email: string, code: string): Promise<void> {
  await wait(800);
  if (code !== "123456") throw new MockResetError("invalid_code");
}

export async function resendResetCode(_email: string): Promise<void> {
  await wait(600);
}

export async function resetPassword(_email: string, _code: string, _newPassword: string): Promise<void> {
  await wait(900);
}