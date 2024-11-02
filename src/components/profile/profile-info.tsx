import { useRef, useState } from "react";
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
import { Copy, Edit, Globe, MapPin } from "lucide-react";
import { ProfileProps } from "@/lib/types";
import { parseDate } from "@/lib/utils";
import { useUser } from "@/lib/hooks/useUser";
import {
  setBio,
  setLink,
  setLocation,
  updateBio,
  updateLink,
  updateLocation,
  uploadAvatar,
} from "@/store/slices/user-slice";
import { useCopyToClipboard } from "react-use";
import { createToast } from "@/lib/utils";

function ProfileInfo({
  profileName,
  fullName = "",
  createdAt,
  bio,
  status,
  isLocked,
  link,
  avatar,
  location,
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { dispatch, uid } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();

  const [tempAvatar, setTempAvatar] = useState<string>();

  const getDate = () => {
    const parsed = parseDate(createdAt);
    return parsed.toLocaleDateString(["en-US"], {
      month: "long",
      year: "numeric",
    });
  };

  const handleCopy = () => {
    if (!isEditing) {
      copyToClipboard(`blow-project.com/profile/${link}`);
      createToast({
        text: `Copied to clipboard!`,
        icon: "📝",
        color: "black",
        pos: "top-center",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const avatarFile = e.target.files?.[0];

    setFile(avatarFile);

    if (avatarFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(avatarFile);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          {!isLocked && (
            <Button
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
              src={tempAvatar || avatar}
              style={{
                aspectRatio: "80/80",
                objectFit: "cover",
              }}
              width="80"
            />
            {isEditing && (
              <>
                <Button
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
                  onChange={(e) => handleFileChange(e)}
                />
              </>
            )}
          </div>
          <div>
            <h3 className="font-semibold">
              {profileName}
              <sup
                className={`ml-1 font-semibold ${
                  status === "Active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {status}
              </sup>
            </h3>
            <h3 className="font-extralight">{fullName}</h3>
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
            value={bio}
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
                value={location}
                onChange={(e) => dispatch(setLocation(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Profile Link</Label>
            <div className="flex flex-row gap-2 place-content-center">
              <div className="flex items-center w-full">
                <Globe className="min-h-4 min-w-4 text-primary" />
                <Input
                  value={"blow-project.com/profile/"}
                  className="ml-2 w-auto rounded-r-none border-r-0 pr-0"
                  disabled={true}
                />
                <Input
                  id="link"
                  placeholder="Your profile link"
                  value={`${link}`}
                  className="rounded-l-none -ml-4 border-l-0 pl-0 w-full"
                  style={{ outline: "none" }}
                  onChange={(e) => dispatch(setLink(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
              <Button variant="default" size="icon" onClick={handleCopy}>
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
            className="ml-auto text-secondary"
            onClick={() => {
              dispatch(uploadAvatar({ file: file!, link }));
              dispatch(updateLocation({ location, uid }));
              dispatch(updateBio({ bio, uid }));
              dispatch(updateLink({ link, uid }));
              setIsEditing(false);

              createToast({
                text: `Changes have been saved`,
                icon: "✅",
                color: "green",
                pos: "top-center",
              });
            }}
          >
            Save Changes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProfileInfo;
