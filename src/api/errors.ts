export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;
  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }
}

export type FieldErrors = Record<string, string[]>;

// The API returns Zod's flattened `fieldErrors` as `details` on VALIDATION_ERROR.
export function toFieldErrors(err: unknown): FieldErrors | null {
  if (!(err instanceof ApiError) || err.code !== "VALIDATION_ERROR") return null;
  const { details } = err;
  if (typeof details !== "object" || details === null) return null;
  const entries = Object.entries(details).filter(
    (e): e is [string, string[]] =>
      Array.isArray(e[1]) && e[1].every((m) => typeof m === "string"),
  );
  return entries.length ? Object.fromEntries(entries) : null;
}
