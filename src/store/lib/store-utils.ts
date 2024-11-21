import {
  ErrorType,
  FetchedProfileType,
  IProfile,
  IUser,
  StatusHandlingType,
} from "@/lib/types";
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { User } from "@/supabase/db.types";
import { AVATAR_PLACEHOLDER } from "@/lib/constants";

export const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const getUser = (state: IUser, fetched: User) => {
  const {
    user: {
      username,
      full_name,
      email,
      avatar,
      bio,
      location,
      link,
      likedPosts,
      likedComments,
    },
    uid,
    created_at,
  } = fetched;

  state.data.uid = uid;
  state.data.email = email;
  state.data.username = username;
  state.data.fullName = full_name;

  state.data.avatar = avatar || AVATAR_PLACEHOLDER;
  state.data.bio = bio || "";
  state.data.location = location || "";
  state.data.link = link || username.toLowerCase();

  state.data.created_at = created_at;
  state.data.likedPosts = likedPosts || [];
  state.data.likedComments = likedComments || [];
  state.data.password = "";
  state.captcha = "";
  state.data.otp = "";
};

export const getProfile = (state: IProfile, fetched: FetchedProfileType) => {
  const { username, bio, status, created_at, link, avatar, location, uid } =
    fetched[0];

  state.data.uid = uid;
  state.data.location = location;
  state.data.avatar = avatar;
  state.data.profileName = username;
  state.data.bio = bio;
  state.data.status = status;
  state.data.createdAt = created_at;
  state.data.link = link;
};

export const handleFulfill = (state: StatusHandlingType) => {
  state.UIError = null;
  state.maintain.error = null;
  state.maintain.status = "fulfilled";
};

export const getError = <I extends StatusHandlingType>(
  state: I,
  action: unknown
) => {
  const error = (action as PayloadAction<ErrorType>).payload;

  state.UIError = error!.message;
  state.maintain.error = error;
  state.maintain.status = "rejected";
};
