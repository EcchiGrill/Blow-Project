import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Activity from "./activity";
import ProfileInfo from "./profile-info";
import { useParams } from "react-router-dom";
import ErrorBoundary from "../404/error-boundary";
import { useProfile } from "@/lib/hooks/useProfile";
import { useEffect } from "react";
import { fetchProfilePage } from "@/store/slices/profile-slice";
import { useUser } from "@/lib/hooks/useUser";

function Profile() {
  const { userlink } = useParams();

  const {
    dispatch,
    status,
    bio,
    profileName,
    createdAt,
    error,
    avatar,
    location,
  } = useProfile();

  const { link } = useUser();

  useEffect(() => {
    dispatch(fetchProfilePage(userlink));
  }, [dispatch, userlink]);

  return !error ? (
    <main className="w-inherit sm:container mx-auto px-4 py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileInfo
            status={status!}
            avatar={avatar!}
            profileName={profileName!}
            bio={bio!}
            location={location!}
            link={userlink!}
            createdAt={createdAt!}
            isLocked={userlink !== link}
          />
        </TabsContent>
        <TabsContent value="activity">
          <Activity />
        </TabsContent>
      </Tabs>
    </main>
  ) : (
    <ErrorBoundary msg={`${error}`} />
  );
}

export default Profile;
