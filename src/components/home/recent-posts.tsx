import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePosts } from "@/lib/hooks/usePosts";
import { getAgoDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AVATAR_PLACEHOLDER } from "@/lib/constants";
import { useUser } from "@/lib/hooks/useUser";

function RecentPosts() {
  const { likedPosts } = useUser();
  const { recentPosts, error } = usePosts();
  const nav = useNavigate();

  const getShortDesc = (content: string) => {
    if (content.length < 100) return content;

    const sliced = content.slice(0, 100);
    const shortenArr = sliced.split(" ");

    if (shortenArr.length === 1) return sliced.padEnd(sliced.length + 3, ".");

    shortenArr.pop();
    const shorten = shortenArr.join(" ");

    return shorten.padEnd(shorten.length + 3, ".");
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-secondary sm:text-4xl md:text-5xl mb-8">
          Recent Posts
        </h2>
        {error && (
          <p className="text-lg mb-5 text-center text-error">{error}</p>
        )}
        {recentPosts && (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col xl:w-72 h-[22rem] relative"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="break-words">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col place-content-between h-3/4">
                    <div>
                      <p className="flex items-center space-x-2 text-sm text-primary">
                        <Avatar
                          onClick={() => nav(`/profile/${post.link!}`)}
                          className="cursor-pointer "
                        >
                          <AvatarImage
                            src={post.avatar || AVATAR_PLACEHOLDER}
                            alt={post.username!}
                            className="h-6 w-6 rounded-full xl:mt-0.5"
                          />
                          <AvatarFallback>{post.username}</AvatarFallback>
                        </Avatar>
                        <span>
                          {post.username} • {getAgoDate(post.date)}
                        </span>
                      </p>
                      {post.image![0] ? (
                        <img src={post.image![0]} className="h-44 w-44 mt-3" />
                      ) : (
                        <p className="mt-2 break-words">
                          {getShortDesc(post.content!)}
                        </p>
                      )}
                    </div>
                    <div className="w-5/6 flex flex-col absolute bottom-5">
                      <p className="flex gap-2 items-center justify-end text-base font-light max-xs:mb-7">
                        <b>{post.likes}</b>

                        <Heart
                          className="h-5 w-5 mt-0.5"
                          fill={
                            likedPosts.includes(post.id)
                              ? "#fff5ef"
                              : "transparent"
                          }
                        />
                      </p>
                      <Link
                        to={`/feed/post-${post.id}`}
                        className="w-fit max-xs:w-full"
                      >
                        <Button variant="default" className="max-xs:w-full">
                          Read More
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                onClick={() => window.scrollTo(0, 0)}
                to={{ pathname: "/feed" }}
              >
                <Button variant="secondary" size="lg">
                  View All Posts
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default RecentPosts;
