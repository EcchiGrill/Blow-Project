import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import {
  selectProfileAvatar,
  selectProfileBio,
  selectProfileCreatedAt,
  selectProfileError,
  selectProfileLocation,
  selectProfileName,
  selectProfileStatus,
  selectProfileUID,
} from "@/store/slices/profile-slice";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProfileStatus);
  const profileName = useAppSelector(selectProfileName);
  const profileBio = useAppSelector(selectProfileBio);
  const profileLocation = useAppSelector(selectProfileLocation);
  const createdAt = useAppSelector(selectProfileCreatedAt);
  const error = useAppSelector(selectProfileError);
  const avatar = useAppSelector(selectProfileAvatar);
  const uid = useAppSelector(selectProfileUID);

  return {
    dispatch,
    status,
    profileBio,
    profileLocation,
    profileName,
    createdAt,
    error,
    avatar,
    location,
    uid,
  };
};
