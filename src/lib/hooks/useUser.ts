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
  selectStatus,
  selectAvatar,
  selectLink,
  selectLocation,
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
  const status = useAppSelector(selectStatus);
  const bio = useAppSelector(selectBio);
  const avatar = useAppSelector(selectAvatar);
  const myLocation = useAppSelector(selectLocation);

  // const [activeUsers, setActiveUsers] = useState<unknown[]>();
  const captchaRef = useRef<HCaptcha>(null);

  //ACTIVITY Soon..

  // const isIdle = useIdle(IDLE_TIME);

  // useEffect(() => {
  //   const activity = supabase.channel("activity", {
  //     config: { private: true },
  //   });

  //   activity.on("presence", { event: "sync" }, () => {
  //     const users = new Set();
  //     for (const key in activity.presenceState()) {
  //       //@ts-expect-error link
  //       users.add(activity.presenceState()[key][0].link);
  //     }

  //     // setActiveUsers([...users]);
  //   });

  //   activity.subscribe(async (status) => {
  //     if (status === "SUBSCRIBED") {
  //       activity.track({ link });
  //     }
  //   });

  //   if (isIdle) {
  //     activity.unsubscribe();
  //   }

  //   return () => {
  //     activity.unsubscribe();
  //   };
  // }, [dispatch, isIdle, link, activeUsers]);

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
    status,
    bio,
    link,
    avatar,
    myLocation,
  };
};
