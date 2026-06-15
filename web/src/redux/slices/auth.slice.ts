import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { authService } from "@/features/auth/services/auth.service";
import { LoginUserFormData } from "@/features/auth/schemas/auth.schema";

import { IUser, AuthResponse } from "@/features/auth/types/user.types";

import { tokenService } from "@/lib/auth.token";
import { RegisterPayload } from "@/features/auth/types/auth.types";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

/* -------------------------------------------------------------------------- */
/*                                   THUNKS                                   */
/* -------------------------------------------------------------------------- */

export const fetchUser = createAsyncThunk<IUser, void, { rejectValue: string }>(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch {
      return rejectWithValue("Failed to fetch user");
    }
  },
);

export const loginUserThunk = createAsyncThunk<
  AuthResponse,
  LoginUserFormData,
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.login(data);

    tokenService.setToken(response.accessToken);

    return response;
  } catch {
    return rejectWithValue("Invalid email or password");
  }
});

export const registerUserThunk = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.register(data);

    tokenService.setToken(response.accessToken);

    return response;
  } catch {
    return rejectWithValue("Registration failed");
  }
});

/* -------------------------------------------------------------------------- */
/*                                    SLICE                                   */
/* -------------------------------------------------------------------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      tokenService.clearToken();

      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    setAuthResolved: (state) => {
      state.isLoading = false;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* --------------------------- FETCH CURRENT USER -------------------------- */

      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })

      .addCase(fetchUser.rejected, (state) => {
        tokenService.clearToken();

        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      /* -------------------------------- LOGIN -------------------------------- */

      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })

      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      })

      /* ------------------------------- REGISTER ------------------------------- */

      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })

      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Registration failed";
      });
  },
});

export const { logout, setAuthResolved, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
