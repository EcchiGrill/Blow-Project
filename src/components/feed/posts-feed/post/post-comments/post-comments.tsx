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
  selectActiveComments,
  selectActivePostId,
  selectCommentContent,
  setCommentContent,
} from "@/store/slices/posts-slice";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import Comment from "./comment";
import EditorTools from "../../editor-tools";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useState } from "react";
import { LoaderIcon, XIcon } from "lucide-react";
import { usePosts } from "@/lib/hooks/usePosts";
import { checkNSFW } from "@/lib/utils";

function PostComments({ postId }: { postId: number }) {
  const dispatch = useAppDispatch();

  const activeComments = useAppSelector(selectActiveComments);
  const activeId = useAppSelector(selectActivePostId);
  const commentContent = useAppSelector(selectCommentContent);

  const [isSending, setSending] = useState(false);

  const [height, setHeight] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const { handleCommentSubmit, isPending } = usePosts();

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles) {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];

        const reader = new FileReader();

        reader.onload = (e) => {
          //@ts-expect-error result
          setImages((prev) => [...prev, e.target?.result]);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

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
          <form
            className="w-full space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();

              if (images.length) {
                const imgs = images.map((image) => {
                  const img = new Image();
                  img.src = image;

                  return img;
                });

                await Promise.all(
                  imgs.map(async (img) => {
                    const isNSFW = await checkNSFW(img, setSending);
                    return isNSFW;
                  })
                ).then((result) => {
                  handleCommentSubmit(
                    images,
                    setImages,
                    setSending,
                    result.includes(true)
                  );
                });
              } else {
                handleCommentSubmit(images, setImages, setSending);
              }
            }}
          >
            <div
              className="relative"
              {...(!isDragActive && getRootProps())}
              onClick={(e) => e.preventDefault()}
            >
              <Textarea
                style={{ height: `${height}` }}
                placeholder="Add a comment..."
                className="flex box-border resize-y overflow-hidden "
                value={commentContent}
                onChange={(e) => {
                  dispatch(setCommentContent(e.target.value));
                  setHeight(
                    e.target.value
                      ? e.currentTarget.scrollHeight.toString() + "px"
                      : "100%"
                  );
                }}
              />
              {images && (
                <div
                  className={`grid sm:grid-cols-2 gap-y-5 md:gap-y-10 mt-4 md:place-items-center`}
                >
                  {images.map((src, index) => (
                    <div
                      key={index + src}
                      className="relative h-64 w-64 flex place-content-center"
                    >
                      <Button
                        onClick={() =>
                          setImages(() => {
                            const filtered = images.filter(
                              (_, i) => i !== index
                            );
                            return filtered;
                          })
                        }
                        className="absolute top-2 right-2 cursor-pointer text-red-500 px-2 p-2"
                      >
                        <XIcon className="w-5 h-5" />
                      </Button>

                      <img src={src} className="h-full" />
                    </div>
                  ))}
                  {isDragActive && (
                    <div
                      {...getRootProps()}
                      style={{ height: `${height}` }}
                      className="absolute w-full h-[60px] top-0 bg-gray-700 opacity-75 text-2xl text-white flex justify-center items-center"
                    >
                      <h2>Drop here...</h2>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4 items-end relative">
              <Button type="submit" disabled={isSending}>
                {isSending && (
                  <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
                )}
                {isSending ? "Sending..." : "Send"}
              </Button>
              <EditorTools
                getInputProps={getInputProps}
                getRootProps={getRootProps}
              />
            </div>
          </form>
        </CardFooter>
      </Card>
    )
  );
}

export default PostComments;
