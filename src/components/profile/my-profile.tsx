import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Activity from "./activity";
import ProfileInfo from "./profile-info";
import { Link, useLocation } from "react-router-dom";
import { CornerDownRight } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { usePosts } from "@/lib/hooks/usePosts";
import { useEffect } from "react";
import { fetchPosts } from "@/store/slices/posts-slice";

function MyProfile() {
  const location = useLocation();
  const {
    dispatch,
    isLogged,
    username,
    fullName,
    createdAt,
    status,
    bio,
    link,
    avatar,
    myLocation,
    uid,
  } = useUser();

  const { posts } = usePosts();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <main
      className={
        "w-inherit sm:container mx-auto px-4 py-8 " +
        `${!isLogged && " flex place-items-center place-content-center"}`
      }
    >
      {isLogged ? (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" style={{ outline: 0 }}>
            <ProfileInfo
              avatar={avatar}
              profileName={username}
              fullName={fullName}
              createdAt={createdAt!}
              status={status!}
              location={myLocation!}
              bio={bio!}
              link={link}
              isLocked={false}
              profilePosts={posts?.filter((post) => post.author === uid)}
            />
          </TabsContent>
          <TabsContent value="activity">
            <Activity />
          </TabsContent>
        </Tabs>
      ) : (
        <Link
          to="/login"
          className="text-error text-3xl flex underline flex-row place-items-center gap-2"
          state={{ login: location }}
        >
          Please login first <CornerDownRight className="text-xl self-end" />
        </Link>
      )}
    </main>
  );
}

export default MyProfile;
