import { LucideIcon } from "lucide-react";
import { Location, NavigateFunction } from "react-router-dom";
import { PostgrestError, Session } from "@supabase/supabase-js";
import { Database } from "@/supabase/db.types";
import { ToastPosition } from "react-hot-toast";
import { ReactNode } from "react";

export function getFetchedPostType(db: Database) {
  return db.public.Tables.posts.Row;
}

export type FetchedPostType = ReturnType<typeof getFetchedPostType>;

export type FetchedPostsType = FetchedPostType[];

export type ErrorType = PostgrestError | null;

export type GetErrorType = {
  UIError?: string | null | undefined;
  maintain: {
    error?: ErrorType | undefined | null;
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

export type SessionType = {
  isLogged?: boolean;
  session: Session | null;
};

type UserData = {
  otp?: string;
  session?: Session | null;
  email_verified?: boolean;
  created_at?: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
};

export interface IUser {
  isLogged?: boolean;
  UIError?: string | null;
  data: UserData;
  maintain: {
    error?: ErrorType;
    status?: StatusType;
  };
  isBackToLogin: boolean;
  isOTPConfirm: boolean;
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

export interface AuthContainerProps {
  nav?: NavigateFunction;
  goBack?: VoidFunction;
  children: ReactNode;
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
