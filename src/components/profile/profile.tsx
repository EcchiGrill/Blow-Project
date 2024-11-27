import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import ErrorBoundary from "../404/error-boundary";
import { useProfile } from "@/lib/hooks/useProfile";
import { useEffect } from "react";
import { fetchProfilePage } from "@/store/slices/profile-slice";
import { useUser } from "@/lib/hooks/useUser";
import { usePosts } from "@/lib/hooks/usePosts";
import { fetchPosts } from "@/store/slices/posts-slice";
import ProfileInfo from "./profile-info/profile-info";
import ActivityFeed from "./activity-feed/activity-feed";

function Profile() {
  const { userlink } = useParams();

  const {
    dispatch,
    profileBio,
    profileLocation,
    profileName,
    createdAt,
    error,
    avatar,
    uid,
    profiles,
    profileActivity,
  } = useProfile();

  const { link, fullName, bio, myLocation, username, activity } = useUser();

  const { posts } = usePosts();

  useEffect(() => {
    dispatch(fetchProfilePage(userlink));
    dispatch(fetchPosts());
  }, [dispatch, userlink, profiles]);

  return profiles.length ? (
    !error ? (
      <main className="w-inherit sm:container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" style={{ outline: 0 }}>
            <ProfileInfo
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
          <TabsContent value="activity" style={{ outline: 0 }}>
            <ActivityFeed
              activity={userlink === link ? activity : profileActivity!}
            />
          </TabsContent>
        </Tabs>
      </main>
    ) : (
      <ErrorBoundary msg={`${error}`} />
    )
  ) : (
    ""
  );
}

export default Profile;
