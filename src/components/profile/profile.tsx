import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Activity from "./activity";
import ProfileInfo from "./profile-info";
import { useParams } from "react-router-dom";
import ErrorBoundary from "../404/error-boundary";
import { useProfile } from "@/lib/hooks/useProfile";
import { useEffect } from "react";
import { fetchProfilePage } from "@/store/slices/profile-slice";
import { useUser } from "@/lib/hooks/useUser";
import { usePosts } from "@/lib/hooks/usePosts";
import { fetchPosts } from "@/store/slices/posts-slice";

function Profile() {
  const { userlink } = useParams();

  const {
    dispatch,
    status,
    profileBio,
    profileLocation,
    profileName,
    createdAt,
    error,
    avatar,
    uid,
  } = useProfile();

  const { link, fullName, bio, myLocation, username } = useUser();

  const { posts } = usePosts();

  useEffect(() => {
    dispatch(fetchProfilePage(userlink));
    dispatch(fetchPosts());
  }, [dispatch, userlink]);

  return !error ? (
    <main className="w-inherit sm:container mx-auto px-4 py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" style={{ outline: 0 }}>
          <ProfileInfo
            status={status!}
            avatar={avatar!}
            profileName={userlink === link ? username : profileName!}
            profileUID={uid}
            fullName={userlink === link ? fullName : ""}
            profilePosts={posts?.filter((post) => post.author === uid)}
            bio={userlink === link ? bio : profileBio!}
            location={userlink === link ? myLocation : profileLocation!}
            link={userlink || link}
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
