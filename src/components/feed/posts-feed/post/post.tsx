import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FetchedPostType } from "@/lib/types";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import PostComments from "./post-comments/post-comments";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import { createToast, getAgoDate } from "@/lib/utils";
import { useCopyToClipboard, useInterval } from "react-use";
import { setActiveComments, setActivePostId } from "@/store/slices/posts-slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { selectLikedPosts } from "@/store/slices/user-slice";
import { useState } from "react";
import { AVATAR_PLACEHOLDER } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

function Post({
  className,
  post,
  handleLike,
  activeId,
  isPending,
  imgClassName,
}: {
  className?: string;
  post: FetchedPostType;
  activeId: number | null;
  isPending: boolean;
  imgClassName: string;
  handleLike: (id: number, likes: number) => void;
}) {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();

  const handleShare = (id: number) => {
    copyToClipboard(`blow-project.com/feed/post-${id}`);
    createToast({
      text: `Link copied!`,
      icon: "📝",
      color: "black",
      pos: "bottom-right",
    });
  };

  const likedPosts = useAppSelector(selectLikedPosts);

  const [timemark, setTimemark] = useState("");

  useInterval(() => {
    setTimemark(getAgoDate(post.date));
  }, 1000);

  return (
    <>
      <Card id={`post-${post.id}`} className={className}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Avatar
              onClick={() => nav(`/profile/${post.link!}`)}
              className="cursor-pointer"
            >
              <AvatarImage
                src={post.avatar || AVATAR_PLACEHOLDER}
                alt={post.username!}
              />
              <AvatarFallback>{post.username}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{post.username}</CardTitle>
              <p className="text-sm text-primary">{timemark}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="font-semibold">{post.title}</h2>
          {post.content && (
            <p className="mt-3 w-[80vw] md:w-[70vw] 2xl:w-[27vw] 3xl:w-[46vh] break-words">
              {post.content}
            </p>
          )}
          {post.image && (
            <div
              className={`grid grid-cols-2 gap-y-5 ${
                post.image.length > 1 && imgClassName
              }`}
            >
              {post.image.map((src) => (
                <div key={src} className="flex place-items-center mt-2">
                  <img src={src} className="max-h-64" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-around sm:justify-end max-xs:gap-1 gap-3">
          <Button
            className="max-xs:w-24"
            onClick={() => {
              handleLike(post.id, post.likes);
            }}
            variant={`${!likedPosts.includes(post.id) ? "ghost" : "default"}`}
            disabled={isPending}
          >
            <ThumbsUp className="mr-2 min-h-4 min-w-4  xs:h-4 xs:w-4" />
            {post.likes} Likes
          </Button>
          <Button
            className="max-xs:w-32"
            variant={`${post.id === activeId ? "default" : "ghost"}`}
            onClick={() => {
              if (post.id === activeId) {
                dispatch(setActivePostId(null));
                dispatch(setActiveComments(null));
                return;
              }
              dispatch(setActivePostId(post.id));
            }}
          >
            <MessageCircle className="mr-2 min-h-4 min-w-4 xs:h-4 xs:w-4" />
            {!post.comments ? 0 : post.comments.length} Comments
          </Button>
          <Button
            variant="ghost"
            className="max-xs:w-24"
            onClick={() => handleShare(post.id)}
          >
            <Share2 className="mr-2 min-h-4 min-w-4  xs:h-4 xs:w-4" />
            Share
          </Button>
        </CardFooter>
      </Card>
      <PostComments postId={post.id} />
    </>
  );
}

export default Post;
