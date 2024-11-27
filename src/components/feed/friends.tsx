import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fan, Handshake } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";
import Activity from "../profile/profile-info/activity";
import { updateFriends } from "@/store/slices/user-slice";
import { useUser } from "@/lib/hooks/useUser";
import { useEffect, useState } from "react";
import { createToast } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { FetchedProfilesType } from "@/lib/types";

function Friends({ className }: { className?: string }) {
  const { dispatch, profiles } = useProfile();
  const [friends, setFriends] = useState<FetchedProfilesType>([]);
  const { friendsUID, isPending, isLogged } = useUser();

  useEffect(() => {
    setFriends(profiles.filter((profile) => friendsUID.includes(profile.uid)));
  }, [dispatch, profiles, friendsUID]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends && friends.length ? (
            friends.map((friend) => (
              <div
                key={friend.username}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <NavLink to={`/profile/${friend.link}`}>
                    <Avatar>
                      <AvatarImage src={friend.avatar} alt={friend.username} />
                      <AvatarFallback>{friend.username}</AvatarFallback>
                    </Avatar>
                  </NavLink>

                  <div>
                    <Activity
                      type="friends"
                      profileName={friend.username}
                      profileUID={friend.uid}
                    />
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  disabled={isPending}
                  onClick={() => {
                    const filteredUID = friendsUID.filter(
                      (id) => id !== friend.uid
                    );

                    setFriends(friends.filter((f) => f.uid !== friend.uid));

                    dispatch(updateFriends(filteredUID));

                    createToast({
                      text: `Unfriend >.<`,
                      icon: "ℹ️",
                      color: "blue",
                      pos: "top-center",
                    });
                  }}
                >
                  Unfriend
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col place-content-center place-items-center text-lg gap-2 opacity-85">
              {isLogged ? (
                <Handshake className="h-11 w-11" />
              ) : (
                <Fan className="h-11 w-11" />
              )}
              <p className="text-center">
                {isLogged
                  ? "You haven't got any friends yet!"
                  : "Login and start making your first Blowquaintances!"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Friends;
