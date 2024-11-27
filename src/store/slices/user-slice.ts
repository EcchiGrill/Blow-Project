import { handleFulfill } from "../lib/store-utils";
import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { createSlice, getError, getUser } from "../lib/store-utils";
import { createToast, getShortDesc } from "@/lib/utils";
import { FetchedActivitiesType, IUser, SessionType } from "@/lib/types";
import { User } from "@/supabase/db.types";
import { Session, UserMetadata } from "@supabase/supabase-js";
import { AVATAR_EXPIRE, AVATAR_PLACEHOLDER } from "@/lib/constants";

const initialState: IUser = {
  isLogged: false,
  data: {
    uid: "",
    avatar: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
    activity: [],
    friends: [],
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
                friends: user.data.friends,
                activity: user.data.activity,
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
            email: data.user.email,
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

    getResetLink: create.asyncThunk(
      async (email: string, { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          if (!user.captcha)
            throw new Error("Don't forget to complete Captcha!");

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            captchaToken: user.captcha,
            redirectTo: "https://blow-project.com/reset-password",
          });

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
          createToast({
            text: "Reset link sent to ur email!",
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

    updateEmail: create.asyncThunk(
      async (email: string, { rejectWithValue }) => {
        try {
          const { error } = await supabase.auth.updateUser({
            email,
          });

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
          createToast({
            text: "Confirmation link sent to ur new email!",
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

    updatePassword: create.asyncThunk(
      async (password: string, { rejectWithValue }) => {
        try {
          const { error } = await supabase.auth.updateUser({
            password,
          });

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
          createToast({
            text: "Successfully updated password!",
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

    resetPassword: create.asyncThunk(
      async (password: string, { rejectWithValue }) => {
        try {
          const { error } = await supabase.auth.updateUser({
            password,
          });

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
          state.isReset = false;

          createToast({
            text: "Now login with your new password!",
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
          state.data.friends = [];
          state.data.activity = [];
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
        { getState, rejectWithValue }
      ) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const activity = [...user.data.activity]
            .sort(
              (a, b) =>
                new Date(b.timemark).getTime() - new Date(a.timemark).getTime()
            )
            .slice(0, 9);

          activity.push({
            type: "username",
            msg: `Rebranded from '${user.data.username}' to '${username}'`,
            timemark: new Date().toISOString(),
          });

          const { data, error } = await supabase
            .from("profiles")
            .update({ username, activity })
            .eq("uid", uid)
            .select();

          if (error || !data) {
            throw new Error(error.message);
          }

          await supabase.auth.updateUser({
            data: {
              username: data[0]!.username,
              activity,
            },
          });

          return { username: data[0].username, activity };
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (
          state,
          action: PayloadAction<{
            username: string;
            activity: FetchedActivitiesType;
          }>
        ) => {
          handleFulfill(state);
          state.data.username = action.payload.username;
          state.data.activity = action.payload.activity;
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

    updateBio: create.asyncThunk(
      async (
        { bio, uid }: { bio: string; uid: string },
        { getState, rejectWithValue }
      ) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const activity = [...user.data.activity]
            .sort(
              (a, b) =>
                new Date(b.timemark).getTime() - new Date(a.timemark).getTime()
            )
            .slice(0, 9);

          activity.push({
            type: "bio",
            msg: `Now proudly blowing with '${getShortDesc(bio, 25)}'`,
            timemark: new Date().toISOString(),
          });

          const { data, error } = await supabase.auth.updateUser({
            data: {
              bio,
              activity,
            },
          });

          await supabase
            .from("profiles")
            .update({ bio: data.user?.user_metadata.bio, activity })
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
          state.data.bio = action.payload.bio;
          state.data.activity = action.payload.activity;
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
        { getState, rejectWithValue }
      ) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const activity = [...user.data.activity]
            .sort(
              (a, b) =>
                new Date(b.timemark).getTime() - new Date(a.timemark).getTime()
            )
            .slice(0, 9);

          activity.push({
            type: "link",
            msg: `Redirected to 'blow-project/profile/${link}'`,
            timemark: new Date().toISOString(),
          });

          const { data, error } = await supabase
            .from("profiles")
            .update({ link: link, activity })
            .eq("uid", uid)
            .select();

          if (error || !data) {
            throw new Error(error.message);
          }

          await supabase.auth.updateUser({
            data: {
              link: data[0]!.link,
              activity,
            },
          });

          return { link: data[0].link, activity };
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (
          state,
          action: PayloadAction<{
            link: string;
            activity: FetchedActivitiesType;
          }>
        ) => {
          handleFulfill(state);
          state.data.link = action.payload.link;
          state.data.activity = action.payload.activity;
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
        { getState, rejectWithValue }
      ) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const activity = [...user.data.activity]
            .sort(
              (a, b) =>
                new Date(b.timemark).getTime() - new Date(a.timemark).getTime()
            )
            .slice(0, 9);

          activity.push({
            type: "location",
            msg: `Relocated to ${location}`,
            timemark: new Date().toISOString(),
          });

          const { data, error } = await supabase.auth.updateUser({
            data: {
              location,
              activity,
            },
          });

          await supabase
            .from("profiles")
            .update({ location: data.user?.user_metadata.location, activity })
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
          state.data.location = action.payload.location;
          state.data.activity = action.payload.activity;
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
          const { user } = getState() as {
            user: IUser;
          };

          const avatarLink = `private/${user.data.uid}.png`;

          const { error } = await supabase.storage
            .from("profile_pics")
            .upload(avatarLink, file, {
              cacheControl: "3600",
              upsert: true,
            });

          const { data } = await supabase.storage
            .from("profile_pics")
            .createSignedUrl(avatarLink, AVATAR_EXPIRE);

          const activity = [...user.data.activity]
            .sort(
              (a, b) =>
                new Date(b.timemark).getTime() - new Date(a.timemark).getTime()
            )
            .slice(0, 9);

          activity.push({
            type: "avatar",
            msg: "Updated profile picture",
            timemark: new Date().toISOString(),
          });

          await supabase
            .from("profiles")
            .update({ avatar: data?.signedUrl, activity })
            .eq("uid", user.data.uid)
            .select();

          await supabase.auth.updateUser({
            data: {
              avatar: data?.signedUrl,
              activity,
            },
          });

          if (error) {
            throw new Error(error.message);
          }

          return { url: data?.signedUrl, activity };
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (
          state,
          action: PayloadAction<{
            url: string | undefined;
            activity: FetchedActivitiesType;
          }>
        ) => {
          handleFulfill(state);
          state.data.avatar = action.payload.url;
          state.data.activity = action.payload.activity;
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

    updateFriends: create.asyncThunk(
      async (friends: string[], { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const { data, error } = await supabase.auth.updateUser({
            data: {
              friends,
            },
          });

          await supabase
            .from("profiles")
            .update({ friends: data.user?.user_metadata.friends })
            .eq("uid", user.data.uid)
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
          state.data.friends = action.payload.friends;
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

    setActivity: create.reducer(
      (state, action: PayloadAction<FetchedActivitiesType>) => {
        return {
          ...state,
          data: {
            ...state.data,
            activity: action.payload,
          },
        };
      }
    ),

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

    setPending: create.reducer((state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        maintain: {
          ...state.maintain,
          status: action.payload ? "pending" : "fulfilled",
        },
      };
    }),

    setReset: create.reducer((state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isReset: action.payload,
      };
    }),

    setFriends: create.reducer((state, action: PayloadAction<string[]>) => {
      return {
        ...state,
        data: {
          ...state.data,
          friends: action.payload,
        },
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
    selectBio: (state) => state.data.bio,
    selectLocation: (state) => state.data.location,
    selectLink: (state) => state.data.link,
    selectAvatar: (state) => state.data.avatar,
    selectFriends: (state) => state.data.friends,
    selectActivity: (state) => state.data.activity,
    selectReset: (state) => state.isReset,
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
  selectLocation,
  selectBio,
  selectLink,
  selectAvatar,
  selectFriends,
  selectActivity,
  selectReset,
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
  setBio,
  setLocation,
  updateBio,
  uploadAvatar,
  updateLink,
  updateLocation,
  setLink,
  updateUsername,
  updateFullname,
  updateFriends,
  setFriends,
  setPending,
  updateEmail,
  updatePassword,
  setActivity,
  getResetLink,
  setReset,
  resetPassword,
} = userSlice.actions;

export default userSlice.reducer;
