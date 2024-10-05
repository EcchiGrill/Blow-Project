import {
  ErrorType,
  FetchedPostType,
  GetErrorType,
  ICreateToast,
} from "@/types";
import toast from "react-hot-toast";
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const parseDate = (dateString: string): Date =>
  new Date(Date.parse(dateString));

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

export const getError = <I extends GetErrorType>(state: I, action: unknown) => {
  const error = (action as PayloadAction<ErrorType>).payload;

  state.UIError = error.message;
  state.maintain.error = error;
  state.maintain.status = "rejected";
};

export const createToast = ({
  text,
  icon,
  color,
  pos = "bottom-right",
}: ICreateToast) => {
  toast(`${text}`, {
    duration: 2500,
    style: { color: `${color}`, paddingRight: "2px" },
    icon: `${icon}`,
    position: `${pos}`,
  });
};
