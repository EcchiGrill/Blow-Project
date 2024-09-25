import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { usePosts } from "@/hooks/usePosts";
import { setContent, setTitle } from "@/store/slices/postsSlice";
import { Input } from "./ui/input";

export function Feed() {
  const [activeTab, setActiveTab] = useState("posts");
  const { posts, error, content, title, addPost, likePost, dispatch } =
    usePosts();

  const friends = [
    { id: 1, name: "Alice Williams", status: "Online" },
    { id: 2, name: "Charlie Brown", status: "Offline" },
    { id: 3, name: "David Lee", status: "Online" },
  ];

  const subscriptions = [
    { id: 1, name: "Tech News Daily", subscribers: "50K" },
    { id: 2, name: "Web Dev Tutorials", subscribers: "75K" },
    { id: 3, name: "Coding Tips & Tricks", subscribers: "100K" },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts Feed</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                className="w-auto mb-2"
                placeholder="Craft ur headline..."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setTitle(e.target.value))
                }
                value={title}
              />
              <Textarea
                placeholder="What's on your mind?"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  dispatch(setContent(e.target.value))
                }
                value={content}
              />
              <Button className="mt-4" onClick={() => addPost()}>
                Post
              </Button>
            </CardContent>
          </Card>
          {error && (
            <p className="text-lg mt-4 text-center text-red-500">
              {error.message}
            </p>
          )}
          {posts && (
            <div className="mt-6 space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/avatar.png`} alt={post.author!} />
                        <AvatarFallback>{post.author}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{post.author}</CardTitle>
                        <p className="text-sm text-primary">{post.date}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h2 className="font-semibold">{post.title}</h2>
                    <p className="mt-3">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      onClick={() => likePost(post.id, post.likes)}
                      variant="ghost"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {post.likes} Likes
                    </Button>
                    <Button variant="ghost">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {post.comments} Comments
                    </Button>
                    <Button variant="ghost">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Your Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/avatar.png`} alt={sub.name} />
                        <AvatarFallback>{sub.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <p className="text-sm text-primary">
                          {sub.subscribers} subscribers
                        </p>
                      </div>
                    </div>
                    <Button variant="default" size="sm">
                      Unsubscribe
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/avatar.png`} alt={friend.name} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-primary">{friend.status}</p>
                      </div>
                    </div>
                    <Button variant="default" size="sm">
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
