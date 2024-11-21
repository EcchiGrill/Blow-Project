import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FetchedCommentsType, FetchedCommentType } from "@/lib/types";
import { getAgoDate } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useInterval } from "react-use";
import {
  addLikedComment,
  removeLikedComment,
  selectLikedComments,
  selectLogged,
} from "@/store/slices/user-slice";
import { createToast } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import { fetchComments, updateCommentLikes } from "@/store/slices/posts-slice";
import { useNavigate } from "react-router-dom";

function Comment({
  comment,
  isPending,
}: {
  comment: FetchedCommentType;
  isPending: boolean;
  activeComments: FetchedCommentsType;
}) {
  const [timemark, setTimemark] = useState("");
  const nav = useNavigate();

  useInterval(() => {
    setTimemark(getAgoDate(comment.timestamp));
  }, 1000);

  const dispatch = useAppDispatch();

  const likedComments = useAppSelector(selectLikedComments);
  const isLogged = useAppSelector(selectLogged);

  const handleCommentLike = (id: string, likes: number) => {
    if (!isLogged) {
      createToast({
        text: "Login first!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (!likedComments.includes(id)) {
      dispatch(addLikedComment(id));
      dispatch(updateCommentLikes({ id, likes: likes + 1 })).then(() => {
        dispatch(fetchComments());
      });

      createToast({ text: "Comment liked!", icon: "❤️", color: "red" });
    } else {
      dispatch(removeLikedComment(id));
      dispatch(updateCommentLikes({ id, likes: likes - 1 })).then(() => {
        dispatch(fetchComments());
      });
    }
  };

  return (
    <div className="flex space-x-4">
      <Avatar
        onClick={() => nav(`/profile/${comment.link!}`)}
        className="cursor-pointer"
      >
        <AvatarImage src={comment.avatar} alt={comment.username} />
        <AvatarFallback>{comment.username}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{comment.username}</h4>
          <span className="text-sm text-primary">{timemark}</span>
        </div>
        {comment.content && (
          <p className="w-[60vw] xs:w-[70vw] sm:w-[60vw] 2xl:w-[27vw] 3xl:w-[36vh] break-words">
            {comment.content}
          </p>
        )}
        {comment.image && (
          <div className="grid grid-cols-2 gap-y-3 mt-4 gap-x-4">
            {comment.image.map((src) => (
              <div className="mt-1 flex place-items-center" key={src}>
                <img src={src} className="h-full max-h-64" />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center text-sm text-primary">
          <Button
            variant={`${
              likedComments.includes(comment.id) ? "default" : "ghost"
            }`}
            size="sm"
            disabled={isPending}
            onClick={() => handleCommentLike(comment.id, comment.likes)}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="mt-0.5"> {comment.likes}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Comment;
