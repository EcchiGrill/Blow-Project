import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import {
  selectPending,
  selectProfileActivity,
  selectProfileAvatar,
  selectProfileBio,
  selectProfileCreatedAt,
  selectProfileError,
  selectProfileLocation,
  selectProfileName,
  selectProfiles,
  selectProfileUID,
} from "@/store/slices/profile-slice";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(selectProfiles);
  const profileName = useAppSelector(selectProfileName);
  const profileBio = useAppSelector(selectProfileBio);
  const profileLocation = useAppSelector(selectProfileLocation);
  const createdAt = useAppSelector(selectProfileCreatedAt);
  const error = useAppSelector(selectProfileError);
  const avatar = useAppSelector(selectProfileAvatar);
  const profileActivity = useAppSelector(selectProfileActivity);
  const uid = useAppSelector(selectProfileUID);
  const isPending = useAppSelector(selectPending);

  return {
    dispatch,
    profileBio,
    profileLocation,
    profileName,
    createdAt,
    error,
    avatar,
    location,
    uid,
    isPending,
    profiles,
    profileActivity,
  };
};
