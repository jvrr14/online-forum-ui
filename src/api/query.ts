// Turns { page: 1, search: undefined } into "?page=1", or "" if nothing is set.
export function buildQuery(params: object = {}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const string = query.toString();
  return string ? `?${string}` : '';
}
