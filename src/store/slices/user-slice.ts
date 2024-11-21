import { handleFulfill } from "../lib/store-utils";
import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { createSlice, getError, getUser } from "../lib/store-utils";
import { createToast } from "@/lib/utils";
import { IUser, SessionType } from "@/lib/types";
import { User } from "@/supabase/db.types";
import { Session, UserMetadata } from "@supabase/supabase-js";
import { AVATAR_EXPIRE, AVATAR_PLACEHOLDER } from "@/lib/constants";

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

          if (user.data.username.length > 50)
            throw new Error("Your username is too long!");

          if (user.data.username.length < 3)
            throw new Error("Your username is too short!");

          if (user.data.fullName.length > 50)
            throw new Error("Your full name is too long!");

          if (user.data.fullName.length < 3)
            throw new Error("Your full name is too short!");

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
                avatar: AVATAR_PLACEHOLDER,
                full_name: user.data.fullName,
                bio: "",
                location: "",
                link: user.data.username.toLowerCase(),
                likedPosts: user.data.likedPosts,
                likedComments: user.data.likedComments,
              },
              captchaToken: user.captcha,
            },
          });

          await supabase.from("profiles").insert([
            {
              uid: data.user?.id,
              username: data.user?.user_metadata.username,
              avatar: data.user?.user_metadata.avatar,
              full_name: data.user?.user_metadata.full_name,
              created_at: data.user?.created_at,
              link: data.user?.user_metadata.link,
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

          state.data.uid = "";
          state.data.username = "";
          state.data.created_at = "";
          state.data.fullName = "";
          state.data.avatar = "";
          state.data.location = "";
          state.data.bio = "";
          state.data.link = "";
          state.data.likedComments = [];
          state.data.likedPosts = [];

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
    updateUsername: create.asyncThunk(
      async (
        { username, uid }: { username: string; uid: string },
        { rejectWithValue }
      ) => {
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: { username },
          });

          await supabase
            .from("profiles")
            .update({ username: data.user?.user_metadata.username })
            .eq("uid", uid)
            .select();

          if (error) throw new Error(error.message);

          return data.user.user_metadata.username;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<string>) => {
          handleFulfill(state);
          state.data.username = action.payload;
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
        },
      }
    ),

    updateFullname: create.asyncThunk(
      async (
        { full_name, uid }: { full_name: string; uid: string },
        { rejectWithValue }
      ) => {
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: { full_name },
          });

          await supabase
            .from("profiles")
            .update({ full_name: data.user?.user_metadata.full_name })
            .eq("uid", uid)
            .select();

          if (error) throw new Error(error.message);

          return data.user.user_metadata.full_name;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<string>) => {
          handleFulfill(state);
          state.data.fullName = action.payload;
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IUser>(state, action);
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
          const { data, error } = await supabase.auth.updateUser({
            data: {
              bio: bio,
            },
          });

          await supabase
            .from("profiles")
            .update({ bio: data.user?.user_metadata.bio })
            .eq("uid", uid)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data.user.user_metadata;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<UserMetadata>) => {
          handleFulfill(state);
          state.data.bio = action.payload.user.bio;
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
          const { data, error } = await supabase.auth.updateUser({
            data: {
              link: link,
            },
          });

          await supabase
            .from("profiles")
            .update({ link: data.user?.user_metadata.link })
            .eq("uid", uid)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data.user.user_metadata;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<UserMetadata>) => {
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
          const { data, error } = await supabase.auth.updateUser({
            data: {
              location: location,
            },
          });

          await supabase
            .from("profiles")
            .update({ location: data.user?.user_metadata.location })
            .eq("uid", uid)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data.user.user_metadata;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<UserMetadata>) => {
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
      async (file: File, { getState, rejectWithValue }) => {
        try {
          debugger;
          const { user } = getState() as {
            user: IUser;
          };

          const avatarLink = `private/${user.data.uid}.png`;

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
            .eq("uid", user.data.uid)
            .select();

          await supabase.auth.updateUser({
            data: {
              avatar: data?.signedUrl,
            },
          });

          if (error) {
            throw new Error(error.message);
          }

          return data?.signedUrl;
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
      debugger;
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

    setRemember: create.reducer(
      (state, action: PayloadAction<boolean | "indeterminate">) => {
        return {
          ...state,
          remember: action.payload,
        };
      }
    ),
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
    selectRemember: (state) => state.data.remember,
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
  selectRemember,
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
  uploadAvatar,
  updateLink,
  updateLocation,
  setLink,
  setRemember,
  updateUsername,
  updateFullname,
} = userSlice.actions;

export default userSlice.reducer;
