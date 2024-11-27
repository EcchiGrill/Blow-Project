import {
  selectCaptcha,
  selectCreatedAt,
  selectEmail,
  selectFullname,
  selectIsBackToLogin,
  selectLikedPosts,
  selectLogged,
  selectOTP,
  selectOTPConfirm,
  selectPassword,
  selectPending,
  selectUID,
  selectUserError,
  selectUsername,
  selectBio,
  selectAvatar,
  selectLink,
  selectLocation,
  selectFriends,
  selectActivity,
  selectReset,
} from "@/store/slices/user-slice";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef } from "react";

export const useUser = () => {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector(selectLogged);
  const isOTPConfirm = useAppSelector(selectOTPConfirm);
  const isPending = useAppSelector(selectPending);
  const isBackToLogin = useAppSelector(selectIsBackToLogin);
  const fullName = useAppSelector(selectFullname);
  const username = useAppSelector(selectUsername);
  const email = useAppSelector(selectEmail);
  const password = useAppSelector(selectPassword);
  const createdAt = useAppSelector(selectCreatedAt);
  const captcha = useAppSelector(selectCaptcha);
  const error = useAppSelector(selectUserError);
  const otp = useAppSelector(selectOTP);
  const uid = useAppSelector(selectUID);
  const link = useAppSelector(selectLink);
  const likedPosts = useAppSelector(selectLikedPosts);
  const bio = useAppSelector(selectBio);
  const avatar = useAppSelector(selectAvatar);
  const myLocation = useAppSelector(selectLocation);
  const friendsUID = useAppSelector(selectFriends);
  const activity = useAppSelector(selectActivity);
  const isReset = useAppSelector(selectReset);

  const captchaRef = useRef<HCaptcha>(null);

  return {
    dispatch,
    isLogged,
    uid,
    fullName,
    username,
    email,
    password,
    captcha,
    error,
    isOTPConfirm,
    captchaRef,
    isPending,
    isBackToLogin,
    createdAt,
    otp,
    likedPosts,
    bio,
    link,
    avatar,
    myLocation,
    friendsUID,
    activity,
    isReset,
  };
};
