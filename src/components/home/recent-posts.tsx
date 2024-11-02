import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts } from "@/lib/hooks/usePosts";
import { getAgoDate } from "@/lib/utils";

function RecentPosts() {
  const { recentPosts, error } = usePosts();

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
                  className="flex flex-col xl:max-w-xs h-80 relative"
                >
                  <CardHeader>
                    <CardTitle className="break-words">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col place-content-between h-3/4">
                    <div>
                      <p className="text-sm text-primary">
                        By {post.author} • {getAgoDate(post.date)}
                      </p>
                      <p className="mt-2 break-words">
                        {getShortDesc(post.content!)}
                      </p>
                    </div>
                    <div className="w-5/6 flex flex-col absolute bottom-5">
                      <p className="text-right font-light max-xs:mb-7">
                        <b>{post.likes}</b> ❤️
                      </p>
                      <Link
                        to={{ pathname: "/feed", hash: `#post-${post.id}` }}
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
