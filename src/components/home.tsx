import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, Mail, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePosts } from "@/hooks/usePosts";
import { Link } from "react-router-dom";

function Home() {
  const { posts, error } = usePosts();

  return (
    <main className="flex flex-col min-h-screen place-items-center">
      <div className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 text-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Blow Project
                </h1>
                <p className="mx-auto max-w-[700px] text-secondary md:text-xl">
                  Discover insightful articles on technology, design, and more.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg pl-2"
                    placeholder="Search posts..."
                    type="text"
                  />
                  <Button type="submit" variant="secondary">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-6">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl text-secondary font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Most Active Users
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="flex items-center p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/avatar.png" />
                        <AvatarFallback>{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-primary leading-none">
                          John Doe {i}
                        </p>
                        <p className="text-sm text-primary font-thin dark:text-gray-400">
                          {100 - i * 10} posts
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto font-medium">{i}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-secondary sm:text-4xl md:text-5xl mb-8">
              Recent Posts
            </h2>
            {error && (
              <p className="text-lg mb-5 text-center text-red-500">
                {error.message}
              </p>
            )}
            {posts && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
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
        <footer className="w-full py-12 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-secondary tracking-tighter sm:text-4xl md:text-5xl">
                  Subscribe to Our Newsletter
                </h2>
                <p className="mx-auto max-w-[600px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Stay updated with our latest posts and announcements.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" variant={"secondary"}>
                    <Mail className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Home;
