import { handleFulfill } from "../lib/store-utils";
import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { createSlice, getError, getUser } from "../lib/store-utils";
import { createToast } from "@/lib/utils";
import { FetchedProfileType, IUser, SessionType } from "@/lib/types";
import { User } from "@/supabase/db.types";
import { Session } from "@supabase/supabase-js";
import { AVATAR_EXPIRE } from "@/lib/constants";

const initialState: IUser = {
  activeUsers: [],
  isLogged: false,
  data: {
    uid: "",
    avatar: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
    likedPosts: [],
    likedComments: [],
    location: "",
    bio: "",
    link: "",
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

          const checkUsername = async () => {
            const { data } = await supabase
              .from("profiles")
              .select()
              .eq("username", user.data.username);

            return { noAvailable: data![0] };
          };

          const { noAvailable } = await checkUsername();

          if (noAvailable) throw new Error("This username is already exist!");

          const { data, error } = await supabase.auth.signUp({
            email: user.data.email,
            password: user.data.password,
            options: {
              data: {
                username: user.data.username,
                full_name: user.data.fullName,
                likedPosts: user.data.likedPosts,
                likedComments: user.data.likedComments,
              },
              captchaToken: user.captcha,
            },
          });

          await supabase.from("profiles").insert([
            {
              uid: data.user?.id,
              username: user.data.username,
              full_name: data.user?.user_metadata.full_name,
              created_at: data.user?.created_at,
              link: data.user?.user_metadata.username.toLowerCase(),
            },
          ]);

          if (error) throw new Error(error.message);
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state) => {
          handleFulfill(state);
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
          handleFulfill(state);

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
          handleFulfill(state);

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
            throw new Error();
          }

          return {
            uid: data.user.id,
            user: data.user.user_metadata,
            created_at: data.user.created_at,
          } as User;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<User>) => {
          handleFulfill(state);
          getUser(state, action.payload);
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          state.isLogged = false;

          getError<IUser>(state, action);
        },
      }
    ),

    fetchProfile: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const { data, error } = await supabase
            .from("profiles")
            .select()
            .eq("uid", user.data.uid)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<FetchedProfileType>) => {
          handleFulfill(state);
          state.data.avatar = action.payload[0].avatar;
          state.data.status = action.payload[0].status;
          state.data.bio = action.payload[0].bio;
          state.data.location = action.payload[0].location;
          state.data.link = action.payload[0].link;
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          state.isLogged = false;
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
          handleFulfill(state);

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

    updateStatus: create.asyncThunk(
      async (status: "Active" | "Inactive", { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const { data, error } = await supabase
            .from("profiles")
            .update({ status: status })
            .eq("uid", user.data.uid)
            .select();

          if (error) throw new Error(error.message);

          return data![0].status;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<"Active" | "Inactive">) => {
          handleFulfill(state);
          state.data.status = action.payload;
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
        },
      }
    ),

    updateBio: create.asyncThunk(
      async (
        { bio, uid }: { bio: string; uid: string },
        { rejectWithValue }
      ) => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .update({ bio: bio })
            .eq("uid", uid)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<FetchedProfileType>) => {
          handleFulfill(state);
          state.data.bio = action.payload[0].bio;
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

    updateLink: create.asyncThunk(
      async (
        { link, uid }: { link: string | undefined; uid: string },
        { rejectWithValue }
      ) => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .update({ link: link })
            .eq("uid", uid)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<FetchedProfileType>) => {
          handleFulfill(state);
          state.data.link = action.payload[0].link;
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

    updateLocation: create.asyncThunk(
      async (
        { location, uid }: { location: string; uid: string },
        { rejectWithValue }
      ) => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .update({ location: location })
            .eq("uid", uid)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<FetchedProfileType>) => {
          handleFulfill(state);
          state.data.location = action.payload[0].location;
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

    uploadAvatar: create.asyncThunk(
      async (
        { file, link }: { file: File; link: string },
        { rejectWithValue }
      ) => {
        try {
          const avatarLink = `private/${link}.png`;

          await supabase.storage.from("profile_pics").upload(avatarLink, file, {
            cacheControl: "3600",
            upsert: true,
          });

          const { data, error } = await supabase.storage
            .from("profile_pics")
            .createSignedUrl(avatarLink, AVATAR_EXPIRE);

          await supabase
            .from("profiles")
            .update({ avatar: data?.signedUrl })
            .eq("link", link)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data.signedUrl;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<string>) => {
          handleFulfill(state);
          state.data.avatar = action.payload;
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
        },
      }
    ),

    addLikedPost: create.reducer((state, action: PayloadAction<number>) => {
      return {
        ...state,
        data: {
          ...state.data,
          likedPosts: [...state.data.likedPosts, action.payload],
        },
      };
    }),

    removeLikedPost: create.reducer((state, action: PayloadAction<number>) => {
      return {
        ...state,
        data: {
          ...state.data,
          likedPosts: [...state.data.likedPosts].filter(
            (id) => id !== action.payload
          ),
        },
      };
    }),

    addLikedComment: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          likedComments: [...state.data.likedComments, action.payload],
        },
      };
    }),

    removeLikedComment: create.reducer(
      (state, action: PayloadAction<string>) => {
        return {
          ...state,
          data: {
            ...state.data,
            likedComments: [...state.data.likedComments].filter(
              (id) => id !== action.payload
            ),
          },
        };
      }
    ),

    setLink: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          link: action.payload,
        },
      };
    }),

    setBio: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          bio: action.payload,
        },
      };
    }),

    setLocation: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: {
          ...state.data,
          location: action.payload,
        },
      };
    }),

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

    setActiveUsers: create.reducer(
      (state, action: PayloadAction<unknown[]>) => {
        return {
          ...state,
          activeUsers: action.payload,
        };
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
    selectUID: (state) => state.data.uid,
    selectFullname: (state) => state.data.fullName,
    selectUsername: (state) => state.data.username,
    selectEmail: (state) => state.data.email,
    selectPassword: (state) => state.data.password,
    selectCreatedAt: (state) => state.data.created_at,
    selectIsBackToLogin: (state) => state.isBackToLogin,
    selectCaptcha: (state) => state.captcha,
    selectUserError: (state) => state.UIError,
    selectOTPConfirm: (state) => state.isOTPConfirm,
    selectOTP: (state) => state.data.otp,
    selectPending: (state) =>
      state.maintain.status === "pending" ? true : false,
    selectLikedPosts: (state) => state.data.likedPosts,
    selectLikedComments: (state) => state.data.likedComments,
    selectStatus: (state) => state.data.status,
    selectActiveUsers: (state) => state.activeUsers,
    selectBio: (state) => state.data.bio,
    selectLocation: (state) => state.data.location,
    selectLink: (state) => state.data.link,
    selectAvatar: (state) => state.data.avatar,
  },
});

export const {
  selectLogged,
  selectSession,
  selectUID,
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
  selectLikedPosts,
  selectLikedComments,
  selectStatus,
  selectActiveUsers,
  selectLocation,
  selectBio,
  selectLink,
  selectAvatar,
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
  addLikedPost,
  removeLikedPost,
  addLikedComment,
  removeLikedComment,
  signOut,
  updateStatus,
  setActiveUsers,
  setBio,
  setLocation,
  updateBio,
  fetchProfile,
  uploadAvatar,
  updateLink,
  updateLocation,
  setLink,
} = userSlice.actions;

export default userSlice.reducer;
