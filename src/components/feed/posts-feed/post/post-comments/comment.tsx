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

function Comment({
  comment,
  isPending,
}: {
  comment: FetchedCommentType;
  isPending: boolean;
  activeComments: FetchedCommentsType;
}) {
  const [timemark, setTimemark] = useState("");

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
      <Avatar>
        <AvatarImage src={comment.avatar} alt={comment.author} />
        <AvatarFallback>{comment.author}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{comment.author}</h4>
          <span className="text-sm text-primary">{timemark}</span>
        </div>
        <p className="w-[60vw] xs:w-[70vw] sm:w-[60vw] 2xl:w-[27vw] 3xl:w-[36vh] break-words">
          {comment.content}
        </p>
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
            {comment.likes}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Comment;
