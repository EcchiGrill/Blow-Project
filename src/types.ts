import { LucideIcon } from "lucide-react";
import { Location } from "react-router-dom";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/supabase/db.types";
import { ToastPosition } from "react-hot-toast";

export function getFetchedPostType(db: Database) {
  return db.public.Tables.posts.Row;
}

export type FetchedPostType = ReturnType<typeof getFetchedPostType>;

export type FetchedPostsType = FetchedPostType[];

export type ErrorType = PostgrestError;

export type GetErrorType = {
  UIError?: string | null | undefined;
  maintain: {
    error?: PostgrestError | undefined;
    status?: StatusType | undefined;
  };
};

export type StatusType = "fulfilled" | "pending" | "rejected";

export interface IAddLike {
  id: number;
  likes: number;
}

export interface IPosts {
  fetchedPosts?: FetchedPostsType;
  UIError?: string | null;
  insertPost: {
    title: string;
    content: string;
  };
  maintain: {
    error?: ErrorType;
    status?: StatusType;
  };
}

export interface IUser {
  isLogged: boolean;
  UIError?: string | null;
  data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  };
  maintain: {
    error?: ErrorType;
    status?: StatusType;
  };
  isBackToLogin: boolean;
  captcha?: string;
}

export type AsyncFnType<T> = () => Promise<T>;

export interface NavItemProps {
  Icon: LucideIcon;
  label: string;
  to: string;
  onClick?: React.MouseEventHandler;
  state?: {
    login: Location;
  };
}

export type useStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface ICreateToast {
  text: string;
  icon: string;
  color?: string;
  pos?: ToastPosition;
}
