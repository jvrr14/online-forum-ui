import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/auth";
import { toFieldErrors, type FieldErrors } from "../../api/errors";
import { usersApi } from "../../api/users";
import { attemptTokenRefresh } from "../../api/refresh";
import type { RootState } from "../../store";
import type { LoginInput, PublicUser, RegisterInput } from "../../types";

interface AuthState {
  user: PublicUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  error: string | null;
  fieldErrors: FieldErrors | null;
}

type FormRejection = { message: string; fieldErrors: FieldErrors | null };

const initialState: AuthState = {
  user: null,
  status: "loading",
  error: null,
  fieldErrors: null,
};

type ThunkConfig = { rejectValue: string };

const message = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong";

export const initializeAuth = createAsyncThunk<
  PublicUser | null,
  void,
  ThunkConfig
>("auth/initialize", async (_, { rejectWithValue }) => {
  try {
    if (!(await attemptTokenRefresh())) return null;
    return await usersApi.getMe();
  } catch (err) {
    return rejectWithValue(message(err));
  }
});

export const login = createAsyncThunk<PublicUser, LoginInput, ThunkConfig>(
  "auth/login",
  async (input, { rejectWithValue }) => {
    try {
      return await authApi.login(input);
    } catch (err) {
      return rejectWithValue(message(err));
    }
  },
);

export const register = createAsyncThunk<
  PublicUser,
  RegisterInput,
  { rejectValue: FormRejection }
>("auth/register", async (input, { rejectWithValue }) => {
  try {
    return await authApi.register(input);
  } catch (err) {
    return rejectWithValue({
      message: message(err),
      fieldErrors: toFieldErrors(err),
    });
  }
});

export const logout = createAsyncThunk("auth/logout", () => authApi.logout());

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      state.fieldErrors = null;
    },
    sessionExpired(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = payload ? "authenticated" : "unauthenticated";
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.status = "unauthenticated";
      })
      .addCase(login.pending, (state) => {
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = "authenticated";
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.error = payload ?? "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.status = "authenticated";
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.error = payload?.message ?? "Registration failed";
        state.fieldErrors = payload?.fieldErrors ?? null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const { clearError, sessionExpired } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthFieldErrors = (state: RootState) => state.auth.fieldErrors;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.user !== null;
export default authSlice.reducer;
