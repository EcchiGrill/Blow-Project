import { parseDate } from "../lib/store-utils";
import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { createSlice, getError, getUser } from "../lib/store-utils";
import { createToast } from "@/lib/utils";
import { IUser, SessionType } from "@/lib/types";
import { User } from "@/supabase/db.types";
import { Session } from "@supabase/supabase-js";

const initialState: IUser = {
  isLogged: false,
  data: {
    fullName: "",
    username: "",
    email: "",
    password: "",
  },
  maintain: {},
  isBackToLogin: false,
  isOTPConfirm: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    registerUser: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          if (!user.captcha)
            throw new Error("Don't forget to complete Captcha!");

          const { error } = await supabase.auth.signUp({
            email: user.data.email,
            password: user.data.password,
            options: {
              data: {
                username: user.data.username,
                full_name: user.data.fullName,
              },
              captchaToken: user.captcha,
            },
          });

          if (error) throw new Error(error.message);
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
          createToast({
            text: `${state.UIError}`,
            icon: "🔴",
            color: "red",
            pos: "top-center",
          });
        },
      }
    ),

    loginUser: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          if (!user.captcha)
            throw new Error("Don't forget to complete Captcha!");

          const { data, error } = await supabase.auth.signInWithPassword({
            email: user.data.email,
            password: user.data.password,
            options: {
              captchaToken: user.captcha,
            },
          });

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;
          state.isLogged = true;

          createToast({
            text: "Logged in Successfully!",
            icon: "☘️",
            color: "green",
            pos: "top-center",
          });
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
          createToast({
            text: `${state.UIError}`,
            icon: "❌",
            color: "red",
            pos: "top-center",
          });
        },
      }
    ),

    confirmEmail: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const {
            data: { session },
            error,
          } = await supabase.auth.verifyOtp({
            email: user.data.email,
            token: user.data.otp!,
            type: "email",
          });

          if (error) {
            throw new Error(error.message);
          }

          return session;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<Session | null>) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;
          state.data.session = action.payload;
          state.isLogged = true;

          createToast({
            text: "Signed up Successfully!",
            icon: "🟢",
            color: "green",
            pos: "top-center",
          });
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
          createToast({
            text: `${state.UIError}`,
            icon: "🔴",
            color: "red",
            pos: "top-center",
          });
        },
      }
    ),

    fetchUser: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { data, error } = await supabase.auth.getUser();

          if (error) {
            throw new Error(error.message);
          }

          return {
            user: data.user.user_metadata,
            created_at: data.user.created_at,
          } as User;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<User>) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;

          getUser(state, action.payload);
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
        },
      }
    ),

    signOut: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { error } = await supabase.auth.signOut();

          if (error) {
            throw new Error(error.message);
          }
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;
          state.data.session = null;
          state.isLogged = false;

          createToast({
            text: "Logged out successfully!",
            icon: "❌",
            color: "red",
            pos: "top-center",
          });
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
          createToast({
            text: `${state.UIError}`,
            icon: "🔴",
            color: "red",
            pos: "top-center",
          });
        },
      }
    ),

    setSession: create.reducer((state, action: PayloadAction<SessionType>) => {
      return {
        ...state,
        isLogged: action.payload.isLogged,
        data: {
          ...state.data,
          session: action.payload.session,
        },
      };
    }),

    setOTP: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          otp: action.payload,
        },
      };
    }),

    setFullname: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          fullName: action.payload,
        },
      };
    }),

    setUsername: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          username: action.payload,
        },
      };
    }),

    setEmail: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          email: action.payload,
        },
      };
    }),

    setPassword: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          password: action.payload,
        },
      };
    }),

    setIsBackToLogin: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        return {
          ...state,
          isBackToLogin: action.payload,
        };
      }
    ),

    setCaptcha: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        captcha: action.payload,
      };
    }),

    setOTPConfirm: create.reducer((state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isOTPConfirm: action.payload,
      };
    }),
  }),

  selectors: {
    selectLogged: (state) => state.isLogged,
    selectSession: (state) => state.data.session,
    selectFullname: (state) => state.data.fullName,
    selectUsername: (state) => state.data.username,
    selectEmail: (state) => state.data.email,
    selectPassword: (state) => state.data.password,
    selectCreatedAt: (state) => {
      const parsed = parseDate(state.data.created_at);
      return parsed.toLocaleDateString(["en-US"], {
        month: "long",
        year: "numeric",
      });
    },
    selectIsBackToLogin: (state) => state.isBackToLogin,
    selectCaptcha: (state) => state.captcha,
    selectUserError: (state) => state.UIError,
    selectOTPConfirm: (state) => state.isOTPConfirm,
    selectOTP: (state) => state.data.otp,
    selectPending: (state) =>
      state.maintain.status === "pending" ? true : false,
  },
});

export const {
  selectLogged,
  selectSession,
  selectFullname,
  selectUsername,
  selectEmail,
  selectPassword,
  selectCreatedAt,
  selectIsBackToLogin,
  selectCaptcha,
  selectUserError,
  selectPending,
  selectOTPConfirm,
  selectOTP,
} = userSlice.selectors;
export const {
  loginUser,
  registerUser,
  setSession,
  setFullname,
  setUsername,
  setEmail,
  setPassword,
  setIsBackToLogin,
  setCaptcha,
  setOTPConfirm,
  setOTP,
  fetchUser,
  confirmEmail,
  signOut,
} = userSlice.actions;

export default userSlice.reducer;
