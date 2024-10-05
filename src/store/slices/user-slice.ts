import { IUser } from "./../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { createSlice, createToast, getError } from "../store-funcs";

const initialState: IUser = {
  isLogged: false,
  data: {
    fullName: "John Doe",
    username: "",
    email: "",
    password: "",
  },
  maintain: {},
  isBackToLogin: false,
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

          const { data, error } = await supabase.auth.signUp({
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

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action) => {
          state.UIError = null;
          state.isLogged = true;

          createToast({
            text: "Signed up Successfully!",
            icon: "🟢",
            color: "green",
            pos: "top-center",
          });
          console.log(action);
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
      async (_, { rejectWithValue }) => {
        try {
          console.log(`Signing In..`);
          // const { user } = getState() as {
          //   user: IUser;
          // };

          // const { data, error } = await supabase.auth.signInWithPassword({
          //   email: user.data.email,
          //   password: user.data.password,
          //   options: {
          //     captchaToken: user.captcha,
          //   },
          // });

          // if (error) {
          //   throw new Error(error.message);
          // }

          // return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state) => {
          state.UIError = null;
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
  }),

  selectors: {
    selectLogged: (state) => state.isLogged,
    selectFullname: (state) => state.data.fullName,
    selectUsername: (state) => state.data.username,
    selectEmail: (state) => state.data.email,
    selectPassword: (state) => state.data.password,
    selectIsBackToLogin: (state) => state.isBackToLogin,
  },
});

export const {
  selectLogged,
  selectFullname,
  selectUsername,
  selectEmail,
  selectPassword,
  selectIsBackToLogin,
} = userSlice.selectors;
export const {
  loginUser,
  registerUser,
  setFullname,
  setUsername,
  setEmail,
  setPassword,
  setIsBackToLogin,
  setCaptcha,
} = userSlice.actions;

export default userSlice.reducer;
