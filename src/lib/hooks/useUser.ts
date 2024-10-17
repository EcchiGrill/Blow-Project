import {
  selectCaptcha,
  selectCreatedAt,
  selectEmail,
  selectFullname,
  selectIsBackToLogin,
  selectLogged,
  selectOTP,
  selectOTPConfirm,
  selectPassword,
  selectPending,
  selectUserError,
  selectUsername,
} from "@/store/slices/user-slice";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useEffect, useRef } from "react";

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

  const captchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    if (error) captchaRef.current?.resetCaptcha();
  }, [error]);

  return {
    dispatch,
    isLogged,
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
  };
};
