import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import {
  selectProfileAvatar,
  selectProfileBio,
  selectProfileCreatedAt,
  selectProfileError,
  selectProfileLocation,
  selectProfileName,
  selectProfileStatus,
} from "@/store/slices/profile-slice";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProfileStatus);
  const profileName = useAppSelector(selectProfileName);
  const bio = useAppSelector(selectProfileBio);
  const location = useAppSelector(selectProfileLocation);
  const createdAt = useAppSelector(selectProfileCreatedAt);
  const error = useAppSelector(selectProfileError);
  const avatar = useAppSelector(selectProfileAvatar);

  return {
    dispatch,
    status,
    bio,
    profileName,
    createdAt,
    error,
    avatar,
    location,
  };
};
