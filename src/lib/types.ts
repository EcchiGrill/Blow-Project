import { LucideIcon } from "lucide-react";
import { Location, NavigateFunction } from "react-router-dom";
import { PostgrestError, Session } from "@supabase/supabase-js";
import { Database } from "@/supabase/db.types";
import { ToastPosition } from "react-hot-toast";
import { ReactNode } from "react";

export function getFetchedPostType(db: Database) {
  return db.public.Tables.posts.Row;
}

export function getFetchedCommentsType(db: Database) {
  return db.public.Tables.posts.Row.comments;
}

export function getFetchedProfileType(db: Database) {
  return db.public.Tables.profiles.Row;
}

export type FetchedPostType = ReturnType<typeof getFetchedPostType>;

export type FetchedPostsType = FetchedPostType[];

export type FetchedCommentsType = ReturnType<typeof getFetchedCommentsType>;

export type FetchedCommentType = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
};

export type FetchedProfileType = ReturnType<typeof getFetchedProfileType>[];

export type ErrorType = PostgrestError | null;

export type StatusType = "fulfilled" | "pending" | "rejected";

type UIErrorType = string | null;

type MaintainType = {
  error?: ErrorType | null;
  status?: StatusType;
};

export type StatusHandlingType = {
  UIError?: UIErrorType;
  maintain: MaintainType;
};

export type SessionType = {
  isLogged?: boolean;
  session: Session | null;
};

export interface IPostLike {
  id?: number;
  likes: number;
}

export interface ICommentLike {
  id?: string;
  likes: number;
}

export interface IFulfillActivePosts {
  activeId: number;
  comments: FetchedCommentsType;
}

export interface IPosts {
  fetchedPosts?: FetchedPostsType;
  UIError?: UIErrorType;
  maintain: MaintainType;
  insertPost: {
    title: string;
    content: string;
  };
  insertComment: {
    content: string;
  };
  comments: {
    activePostId: number | null;
    activeComments: FetchedCommentsType | null;
  };
}

type UserData = {
  uid: string;
  otp?: string;
  session?: Session | null;
  email_verified?: boolean;
  created_at?: string;
  avatar: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  likedPosts: number[];
  likedComments: string[];
  bio: string;
  location: string;
  status?: string;
  link: string;
};

export interface IUser {
  activeUsers: unknown[];
  isLogged?: boolean;
  UIError?: UIErrorType;
  data: UserData;
  maintain: MaintainType;
  isBackToLogin: boolean;
  isOTPConfirm: boolean;
  captcha?: string;
}

type ProfileData = {
  avatar?: string;
  status?: "Active" | "Inactive";
  profileName?: string;
  createdAt?: string;
  bio?: string;
  link?: string;
  location?: string;
};

export interface IProfile {
  UIError?: UIErrorType;
  data: ProfileData;
  maintain: MaintainType;
}

export type AsyncFnType<T> = () => Promise<T>;

export interface ProfileProps {
  avatar: string;
  status: string;
  profileName: string;
  fullName?: string;
  createdAt: string;
  bio: string;
  location: string;
  isLocked: boolean;
  link: string;
}

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
export type ILeaderboard = {
  avatar: string;
  username: string;
  posts: number;
}[];
