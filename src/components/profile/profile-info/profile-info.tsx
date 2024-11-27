import { useEffect, useRef, useState } from "react";
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
import { checkNSFW, createToast } from "@/lib/utils";
import { useUser } from "@/lib/hooks/useUser";
import { setFriends, updateFriends } from "@/store/slices/user-slice";
import { PROFILE_POSTS_COUNT } from "@/lib/constants";
import PostsFeed from "@/components/feed/posts-feed/posts-feed";
import Activity from "./activity";
import { useProfileInfo } from "@/lib/hooks/useProfileInfo";

function ProfileInfo({
  profileName,
  fullName,
  createdAt,
  bio,
  isLocked,
  link,
  avatar,
  location,
  profilePosts,
  profileUID,
}: ProfileProps) {
  const { dispatch, uid, friendsUID, isLogged, isPending } = useUser();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = {
    profileName,
    fullName,
    location,
    link,
    bio,
  };

  const [profile, setProfile] = useState<IProfileInfo>({
    file: undefined,
    tempAvatar: undefined,
    postsCount: PROFILE_POSTS_COUNT,
    isMorePosts: false,
    profileName,
    fullName,
    bio,
    location,
    link,
  });

  const {
    isSaving,
    isEditing,
    getDate,
    handleAvatarChange,
    handleCopy,
    handleSubmit,
    setSaving,
    setIsEditing,
  } = useProfileInfo();

  useEffect(() => {
    setProfile((prev) => {
      return {
        ...prev,
        link,
        profileName,
        fullName,
        bio,
        location,
      };
    });
  }, [link, profileName, fullName, bio, location]);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (profile.tempAvatar) {
              const img = new Image();
              img.src = profile.tempAvatar;

              img.onload = async () => {
                const isNSFW = await checkNSFW(img, setSaving);
                handleSubmit(profile, user, isNSFW);
              };
            } else {
              handleSubmit(profile, user);
            }
          }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {!isLocked && (
                <Button
                  type="button"
                  variant="default"
                  size="icon"
                  disabled={isSaving}
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
            <div className="flex items-center justify-between">
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
                  {isEditing && (
                    <div>
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
                        disabled={isSaving}
                        accept="image/*"
                        onChange={(e) => handleAvatarChange(e, setProfile)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  {isEditing ? (
                    <Input
                      className="text-base py-1 pl-1 mt-4"
                      value={profile.profileName}
                      disabled={isSaving}
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
                    <Activity
                      profileUID={profileUID || uid}
                      profileName={profile.profileName}
                    />
                  )}

                  {isEditing ? (
                    <Input
                      className="font-extralight text-base py-1 pl-1 mt-1 "
                      value={profile.fullName}
                      disabled={isSaving}
                      placeholder="Say my name"
                      onChange={(e) =>
                        setProfile((prev) => {
                          return {
                            ...prev,
                            fullName: e.target.value,
                          };
                        })
                      }
                    />
                  ) : (
                    <h3 className="font-extralight">{fullName}</h3>
                  )}
                  <p className="text-sm text-primary-foreground font-medium">
                    Joined at {getDate(createdAt)}
                  </p>
                </div>
              </div>
              {isLogged && isLocked && (
                <Button
                  type="button"
                  variant="default"
                  disabled={isPending}
                  onClick={() => {
                    if (!profileUID) return;

                    if (!friendsUID.includes(profileUID)) {
                      const friends = [...friendsUID, profileUID];
                      dispatch(setFriends(friends));
                      dispatch(updateFriends(friends));

                      createToast({
                        text: `You are my friend now!`,
                        icon: "👽",
                        color: "green",
                        pos: "top-center",
                      });
                    } else {
                      const friends = friendsUID.filter(
                        (id) => id !== profileUID
                      );
                      dispatch(setFriends(friends));
                      dispatch(updateFriends(friends));

                      createToast({
                        text: `Unfriend >,<`,
                        icon: "ℹ️",
                        color: "blue",
                        pos: "top-center",
                      });
                    }
                  }}
                >
                  {!friendsUID.includes(profileUID!) ? "Friend" : "Unfriend"}
                </Button>
              )}
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
                value={profile.bio}
                onChange={(e) =>
                  setProfile((prev) => {
                    return {
                      ...prev,
                      bio: e.target.value,
                    };
                  })
                }
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
                    disabled={!isEditing || isSaving}
                    value={profile.location}
                    onChange={(e) =>
                      setProfile((prev) => {
                        return {
                          ...prev,
                          location: e.target.value,
                        };
                      })
                    }
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
                      disabled={!isEditing || isSaving}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={() => handleCopy(link)}
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
              <Button
                type="submit"
                className="ml-auto text-secondary"
                disabled={isSaving}
              >
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
          {profilePosts.length > PROFILE_POSTS_COUNT ? (
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
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProfileInfo;
