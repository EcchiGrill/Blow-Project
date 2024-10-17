import { ErrorType, FetchedPostType, GetErrorType, IUser } from "@/lib/types";
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { User } from "@/supabase/db.types";

export const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const parseDate = (dateString: string | undefined): Date =>
  new Date(Date.parse(dateString!));

export const filterDate = (post: FetchedPostType) => {
  const parsedDate = parseDate(post.date);
  const milliseconds = Date.now() - parsedDate.getTime();
  const seconds = Math.trunc(milliseconds / 1000);
  const minutes = Math.trunc(seconds / 60);
  const hours = Math.trunc(minutes / 60);
  const days = Math.trunc(hours / 24);

  if (days >= 1) {
    return (post.date = `${days} days ago`);
  } else if (hours >= 1) {
    return (post.date = `${hours} hours ago`);
  } else if (minutes >= 1) {
    return (post.date = `${minutes} minutes ago`);
  } else {
    return (post.date = `${seconds} seconds ago`);
  }
};

export const getUser = (state: IUser, fetched: User) => {
  const {
    user: { username, full_name, email, email_verified },
    created_at,
  } = fetched;

  state.data.username = username;
  state.data.fullName = full_name;
  state.data.email = email;
  state.data.email_verified = email_verified;
  state.data.created_at = created_at;
  state.data.password = "";
  state.captcha = "";
  state.data.otp = "";
};

export const getError = <I extends GetErrorType>(state: I, action: unknown) => {
  const error = (action as PayloadAction<ErrorType>).payload;

  state.UIError = error!.message;
  state.maintain.error = error;
  state.maintain.status = "rejected";
};
