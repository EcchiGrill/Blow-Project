import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/store/lib/store-hooks";
import { setContent, setTitle } from "@/store/slices/posts-slice";

function CreatePost({
  createPost,
  title,
  content,
}: {
  createPost: VoidFunction;
  title: string;
  content: string;
}) {
  const dispatch = useAppDispatch();

  return (
    <Card id="create-post">
      <CardHeader>
        <CardTitle>Create Post 📌</CardTitle>
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
  );
}

export default CreatePost;
