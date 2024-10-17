import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts } from "@/lib/hooks/usePosts";

function RecentPosts() {
  const { recentPosts, error } = usePosts();

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
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary">
                      By {post.author} • {post.date}
                    </p>
                    <p className="mt-2">{post.content}</p>
                    <p className="text-right mt-2 font-light">
                      Likes: {post.likes}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/feed">
                      <Button variant="default">
                        Read More
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/feed">
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
