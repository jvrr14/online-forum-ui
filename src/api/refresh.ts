import { setAccessToken } from './token';

const BASE_URL = import.meta.env.VITE_API_URL;

async function refresh(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      setAccessToken(accessToken);
      return true;
    }
  } catch {
    // Network error: treat as a failed refresh.
  }

  setAccessToken(null);
  return false;
}

// Refresh tokens are single-use. If several requests hit a 401 together, they
// must share one refresh call; a second call would present the already-consumed
// token and get the whole session revoked.
let refreshPromise: Promise<boolean> | null = null;

export async function attemptTokenRefresh(): Promise<boolean> {
  // A refresh is already running: wait for its result instead of starting another.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refresh();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
