import { usePosts } from "@/lib/hooks/usePosts";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ILeaderboard } from "@/lib/types";
import { useNavigate } from "react-router-dom";

function ActiveUsers() {
  const { posts } = usePosts();
  const nav = useNavigate();

  const getLeaderboard = () => {
    const users: Set<string> = new Set();
    posts?.map((post) => users.add(post.author!));
    const unique = [...users].slice(0, 6);

    const leaders: ILeaderboard = [];

    unique.map((user) => {
      leaders.push({
        avatar: posts?.find((post) => post.author === user)?.avatar,
        username: posts?.find((post) => post.author === user)?.username,

        link: posts?.find((post) => post.author === user)?.link,

        posts: posts!.filter((post) => post.author === user).length,
      });
    });

    return leaders.sort((a, b) => b.posts - a.posts);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-6">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl text-secondary font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
          Most Active Users
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getLeaderboard().map((user, i) => (
            <Card key={i}>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-4">
                  <Avatar
                    onClick={() => nav(`/profile/${user.link!}`)}
                    className="cursor-pointer mb-0.5"
                  >
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-primary leading-none">
                      {user.username}
                    </p>
                    <p className="text-sm text-primary font-thin dark:text-gray-400">
                      {user.posts} posts
                    </p>
                  </div>
                </div>
                <div className="ml-auto font-medium">{i + 1}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ActiveUsers;
