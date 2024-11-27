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

export function getFetchedActivitiesType(db: Database) {
  return db.public.Tables.profiles.Row.activity;
}

export type FetchedPostType = ReturnType<typeof getFetchedPostType>;

export type FetchedPostsType = FetchedPostType[];

export type FetchedCommentsType = ReturnType<typeof getFetchedCommentsType>;

export type FetchedCommentType = FetchedCommentsType[0];

export type FetchedActivitiesType = ReturnType<typeof getFetchedActivitiesType>;

export type FetchedActivityType = FetchedActivitiesType[0];

export type FetchedProfilesType = ReturnType<typeof getFetchedProfileType>[];

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
  avatar: string | undefined;
  username: string;
  fullName: string;
  email: string;
  password: string;
  activity: FetchedActivitiesType;
  friends: string[];
  likedPosts: number[];
  likedComments: string[];
  bio: string;
  location: string;
  status?: string;
  link: string;
};

export interface IUser {
  isLogged?: boolean;
  isReset?: boolean;
  UIError?: UIErrorType;
  data: UserData;
  maintain: MaintainType;
  isBackToLogin: boolean;
  isOTPConfirm: boolean;
  captcha?: string;
}

type ProfileData = {
  uid?: string;
  avatar?: string;
  profileName?: string;
  createdAt?: string;
  bio?: string;
  link?: string;
  location?: string;
  profileActivity?: FetchedActivitiesType;
  profilePosts?: FetchedPostsType | null;
};

export interface IProfile {
  fetchedProfiles: FetchedProfilesType;
  UIError?: UIErrorType;
  data: ProfileData;
  maintain: MaintainType;
}

export type AsyncFnType<T> = () => Promise<T>;

export interface ProfileProps {
  avatar: string;
  profileName: string;
  fullName: string;
  createdAt: string;
  bio: string;
  location: string;
  isLocked: boolean;
  link: string;
  profilePosts?: FetchedPostsType | null;
  profileUID?: string;
}

export interface NavItemProps {
  Icon: LucideIcon;
  label: string;
  to: string;
  onClick?: React.MouseEventHandler;
  state?: {
    login: Location<any>;
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
  avatar?: string;
  username?: string;
  link?: string;
  posts: number;
}[];

export interface IProfileInfo {
  file?: File;
  tempAvatar?: string;
  postsCount: number;
  isMorePosts: boolean;
  link: string;
  profileName: string;
  fullName: string;
  bio: string;
  location: string;
}
