import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Activity from "./activity";
import ProfileInfo from "./profile-info";
import { Link, useLocation } from "react-router-dom";
import { CornerDownRight } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";

function Profile() {
  const location = useLocation();
  const { isLogged } = useUser();

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
          <TabsContent value="profile">
            <ProfileInfo />
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

export default Profile;
