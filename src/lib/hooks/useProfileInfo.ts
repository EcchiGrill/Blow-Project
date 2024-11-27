import { useCopyToClipboard } from "react-use";
import { createToast, parseDate } from "../utils";
import { IProfileInfo, useStateSetter } from "../types";
import { useUser } from "./useUser";
import {
  updateBio,
  updateFullname,
  updateLink,
  updateLocation,
  updateUsername,
  uploadAvatar,
} from "@/store/slices/user-slice";
import { useState } from "react";

export const useProfileInfo = () => {
  const { dispatch, uid } = useUser();

  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setSaving] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();

  const getDate = (createdAt: string) => {
    const parsed = parseDate(createdAt);
    return parsed.toLocaleDateString(["en-US"], {
      month: "long",
      year: "numeric",
    });
  };

  const handleCopy = (link: string) => {
    copyToClipboard(`blow-project.com/profile/${link}`);
    createToast({
      text: `Copied to clipboard!`,
      icon: "📝",
      color: "black",
      pos: "top-center",
    });
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setProfile: useStateSetter<IProfileInfo>
  ) => {
    const avatarFile = e.target.files?.[0];

    setProfile((prev) => {
      return {
        ...prev,
        file: avatarFile,
      };
    });

    if (avatarFile) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        setProfile((prev) => {
          return { ...prev, tempAvatar: e.target?.result as string };
        });
      };
      reader.readAsDataURL(avatarFile);
    }
  };

  const handleSubmit = (
    profile: IProfileInfo,
    user: {
      profileName: string;
      fullName: string;
      location: string;
      bio: string;
      link: string;
    },
    isNSFW?: boolean
  ) => {
    if (isNSFW)
      return createToast({
        text: `Hold up your pic my friend!`,
        icon: "🕵️",
        color: "black",
        pos: "top-center",
      });

    if (profile.profileName.length < 3)
      return createToast({
        text: "Your username is too short!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (profile.fullName.length < 3)
      return createToast({
        text: "Don't forget to type your full name!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (profile.profileName.length > 50)
      return createToast({
        text: "Your username is too long!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (profile.fullName.length > 50)
      return createToast({
        text: "Your full name is too long!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (profile.bio.length > 1500)
      return createToast({
        text: "Your bio is too long!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (profile.link.length > 50)
      return createToast({
        text: "Your link is too long!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (profile.link.length < 3)
      return createToast({
        text: "Your link is too short!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (profile.location.length > 100)
      return createToast({
        text: "Your location is too long!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    setSaving(true);

    Promise.all([
      profile.link.trim() !== user.link.trim() &&
        dispatch(
          updateLink({
            link: profile.link.trim().replace(" ", "_"),
            uid,
          })
        ),
      profile.profileName.trim() !== user.profileName.trim() &&
        dispatch(updateUsername({ username: profile.profileName.trim(), uid })),
      profile.fullName.trim() !== user.fullName.trim() &&
        dispatch(updateFullname({ full_name: profile.fullName.trim(), uid })),
      profile.location.trim() !== user.location.trim() &&
        dispatch(updateLocation({ location: profile.location.trim(), uid })),
      profile.bio.trim() !== user.bio.trim() &&
        dispatch(updateBio({ bio: profile.bio.trim(), uid })),
      profile.file && dispatch(uploadAvatar(profile.file)),
    ])
      .then((promises) => {
        for (const promise of promises) {
          if (promise) console.log(promise);
          if (promise && promise.meta.requestStatus === "rejected") return;
        }

        setIsEditing(false);

        createToast({
          text: `Changes have been saved`,
          icon: "✅",
          color: "green",
          pos: "top-center",
        });
      })
      .finally(() => setSaving(false));
  };

  return {
    handleCopy,
    handleAvatarChange,
    handleSubmit,
    isEditing,
    isSaving,
    getDate,
    setIsEditing,
    setSaving,
  };
};
