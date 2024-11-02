import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  insertComment,
  selectActiveComments,
  selectActivePostId,
  selectCommentContent,
  selectPending,
  setCommentContent,
} from "@/store/slices/posts-slice";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import Comment from "./comment";
import { createToast } from "@/lib/utils";
import { selectLogged } from "@/store/slices/user-slice";

function PostComments({ postId }: { postId: number }) {
  const dispatch = useAppDispatch();

  const activeComments = useAppSelector(selectActiveComments);
  const activeId = useAppSelector(selectActivePostId);
  const isPending = useAppSelector(selectPending);
  const commentContent = useAppSelector(selectCommentContent);
  const isLogged = useAppSelector(selectLogged);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogged) {
      createToast({
        text: "Login first!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (commentContent.trim()) {
      dispatch(insertComment());
      dispatch(setCommentContent(""));
    }
  };

  return (
    activeId === postId && (
      <Card className="w-[95%] mx-auto mr-0">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeComments &&
              activeComments.map((comment) => (
                <Comment
                  activeComments={activeComments}
                  comment={comment}
                  isPending={isPending}
                  key={comment.id}
                />
              ))}
          </div>
        </CardContent>
        <CardFooter>
          <form className="w-full space-y-4" onSubmit={handleCommentSubmit}>
            <Textarea
              placeholder="Add a comment..."
              className="w-full"
              value={commentContent}
              onChange={(e) => dispatch(setCommentContent(e.target.value))}
            />
            <Button type="submit" disabled={isPending}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    )
  );
}

export default PostComments;
