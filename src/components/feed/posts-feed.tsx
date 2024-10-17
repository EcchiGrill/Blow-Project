import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { usePosts } from "@/lib/hooks/usePosts";
import { setContent, setTitle } from "@/store/slices/posts-slice";
import { Input } from "@/components/ui/input";

function PostsFeed({ className }: { className?: string }) {
  const { posts, error, dispatch, title, content, likePost, createPost } =
    usePosts();

  return (
    <div className={className}>
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
          <Button className="mt-4" onClick={() => createPost()}>
            Post
          </Button>
        </CardContent>
      </Card>
      {error && <p className="text-lg mt-4 text-center text-error">{error}</p>}
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
              <CardFooter className="flex justify-around sm:justify-end">
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
    </div>
  );
}
export default PostsFeed;
