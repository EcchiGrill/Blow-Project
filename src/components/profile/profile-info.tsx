import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Edit, Globe, LoaderIcon, MapPin } from "lucide-react";
import { IProfileInfo, ProfileProps } from "@/lib/types";
import { parseDate } from "@/lib/utils";
import { useUser } from "@/lib/hooks/useUser";
import {
  setBio,
  setFullname,
  setLocation,
  updateBio,
  updateFullname,
  updateLink,
  updateLocation,
  updateUsername,
  uploadAvatar,
} from "@/store/slices/user-slice";
import { useCopyToClipboard } from "react-use";
import { createToast } from "@/lib/utils";
import { PROFILE_POSTS_COUNT } from "@/lib/constants";
import PostsFeed from "../feed/posts-feed/posts-feed";

function ProfileInfo({
  profileName,
  fullName,
  createdAt,
  bio,
  status,
  isLocked,
  link,
  avatar,
  location,
  profilePosts,
  profileUID,
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { dispatch, uid } = useUser();

  const [isSaving, setSaving] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<IProfileInfo>({
    file: undefined,
    tempAvatar: undefined,
    postsCount: PROFILE_POSTS_COUNT,
    isMorePosts: false,
    profileName,
    link,
  });

  const getDate = () => {
    const parsed = parseDate(createdAt);
    return parsed.toLocaleDateString(["en-US"], {
      month: "long",
      year: "numeric",
    });
  };

  const handleCopy = () => {
    copyToClipboard(`blow-project.com/profile/${link}`);
    createToast({
      text: `Copied to clipboard!`,
      icon: "📝",
      color: "black",
      pos: "top-center",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatarFile = e.target.files?.[0];

    setProfile((prev) => {
      return {
        ...prev,
        file: avatarFile,
      };
    });

    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => {
          return { ...prev, tempAvatar: e.target?.result as string };
        });
      };
      reader.readAsDataURL(avatarFile);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (profile.profileName.length < 3)
      return createToast({
        text: "Your username is too short!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (fullName.length < 3)
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

    if (fullName.length > 50)
      return createToast({
        text: "Your full name is too long!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    if (bio.length > 1500)
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

    if (location.length > 100)
      return createToast({
        text: "Your location is too long!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });

    dispatch(
      updateLink({
        link: profile.link.trim().replace(" ", "_"),
        uid,
      })
    );

    setSaving(true);

    dispatch(updateUsername({ username: profile.profileName, uid }));
    dispatch(uploadAvatar(profile.file!));
    dispatch(updateFullname({ full_name: fullName, uid }));
    dispatch(updateLocation({ location, uid }));
    dispatch(updateBio({ bio, uid })).finally(() => {
      setSaving(false);
      setIsEditing(false);

      createToast({
        text: `Changes have been saved`,
        icon: "✅",
        color: "green",
        pos: "top-center",
      });
    });
  };

  useEffect(() => {
    setProfile((prev) => {
      return {
        ...prev,
        link,
        profileName,
      };
    });
  }, [link, profileName]);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {!isLocked && (
                <Button
                  type="button"
                  variant="default"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 text-secondary" />
                  <span className="sr-only">Edit Profile</span>
                </Button>
              )}
            </div>
            <CardDescription>
              Manage your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-20 w-20">
                <img
                  className="rounded-full object-cover"
                  height="80"
                  src={profile.tempAvatar || avatar}
                  style={{
                    aspectRatio: "80/80",
                    objectFit: "cover",
                  }}
                  width="80"
                />
                <div className={`${!isEditing && "hidden"}`}>
                  <Button
                    type="button"
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full p-0"
                    variant="default"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Edit className="h-3 w-3 text-secondary"></Edit>
                    <span className="sr-only">Change profile picture</span>
                  </Button>
                  <Input
                    id="picture"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleAvatarChange(e)}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                {isEditing ? (
                  <Input
                    className="text-base py-1 pl-1 mt-4"
                    value={profile.profileName}
                    placeholder="Call me... maybe?"
                    onChange={(e) =>
                      setProfile((prev) => {
                        return {
                          ...prev,
                          profileName: e.target.value,
                        };
                      })
                    }
                  />
                ) : (
                  <h3 className="font-semibold">
                    {profile.profileName}
                    <sup
                      className={`ml-1 font-semibold ${
                        status === "Active" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {status}
                    </sup>
                  </h3>
                )}

                {isEditing ? (
                  <Input
                    className="font-extralight text-base py-1 pl-1 mt-1 "
                    value={fullName}
                    placeholder="Say my name"
                    onChange={(e) => dispatch(setFullname(e.target.value))}
                  />
                ) : (
                  <h3 className="font-extralight">{fullName}</h3>
                )}
                <p className="text-sm text-primary-foreground font-medium">
                  Joined at {getDate()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder={`${
                  !isLocked
                    ? `Any details such as age, occupation or city \nFor example: 23 years old, unemployed loner living on his mother's money`
                    : ""
                }`}
                disabled={!isEditing}
                className="resize-none min-h-36"
                value={bio || ""}
                onChange={(e) => dispatch(setBio(e.target.value))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <Input
                    id="location"
                    placeholder="FBI agents aren't happy with you.. "
                    disabled={!isEditing}
                    value={location || ""}
                    onChange={(e) => dispatch(setLocation(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Profile Link</Label>
                <div className="flex flex-row gap-2 place-content-center">
                  <div className="flex items-center w-full relative">
                    <Globe className="min-h-4 min-w-4 text-primary" />
                    <Input
                      value={"blow-project.com/profile/"}
                      className={`ml-2 w-full border-r-0 pr-0 ${
                        isEditing && "opacity-100"
                      }`}
                      disabled={true}
                    />
                    <Input
                      id="link"
                      placeholder="Your profile link"
                      value={profile.link}
                      className="absolute z-10 left-[203px] w-[calc(100%-210px)] border-x-0 border-y-0 pl-0 bg-transparent disabled:font-normal disabled:text-secondary disabled:opacity-100 xs:left-[208.2px]"
                      style={{ outline: "none" }}
                      onChange={(e) =>
                        setProfile((prev) => {
                          return {
                            ...prev,
                            link: e.target.value,
                          };
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4 text-secondary" />
                    <span className="sr-only">Copy profile url</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && (
              <Button type="submit" className="ml-auto text-secondary">
                {isSaving && (
                  <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      {profilePosts?.length ? (
        <>
          <Card className="bg-primary shadow-none border-0">
            <CardHeader className="pb-0 text-secondary text-2xl pl-2">
              <CardTitle>My Posts</CardTitle>
              <CardDescription className="text-secondary text-base">
                Explore the shitposts of{" "}
                <b className="text-md">{profileName}</b>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-0 xs:p-6">
              <PostsFeed
                posts={profilePosts?.filter(
                  (post) => post.author === profileUID || uid
                )}
                postsCount={profile.postsCount}
                imgClassName="place-items-center"
              />
            </CardContent>
          </Card>
          <div className="mt-2 text-center">
            <Button
              type="button"
              variant="secondary"
              className="px-10"
              onClick={() => {
                if (!profile.isMorePosts) {
                  setProfile((prev) => {
                    return {
                      ...prev,
                      postsCount: profilePosts.length,
                      isMorePosts: true,
                    };
                  });
                } else {
                  setProfile((prev) => {
                    return {
                      ...prev,
                      postsCount: PROFILE_POSTS_COUNT,
                      isMorePosts: false,
                    };
                  });
                }
              }}
            >
              {profile.isMorePosts ? "Show Less" : "Show More"}
            </Button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileInfo;
