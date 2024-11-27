import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/store/lib/store-hooks";
import { setContent, setTitle } from "@/store/slices/posts-slice";
import { LoaderIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import EditorTools from "./editor-tools";
import { usePosts } from "@/lib/hooks/usePosts";
import { checkNSFW } from "@/lib/utils";

function PostEditor({ title, content }: { title: string; content: string }) {
  const dispatch = useAppDispatch();

  const [isPosting, setPosting] = useState(false);

  const { handleCreate } = usePosts();

  const [height, setHeight] = useState("");

  const [images, setImages] = useState<string[]>([]);

  const [focus, setFocus] = useState<"title" | "content">("content");

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
    <Card>
      <CardHeader>
        <CardTitle>Create Post 📌</CardTitle>
      </CardHeader>
      <CardContent>
        <form
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
                  const isNSFW = await checkNSFW(img, setPosting);
                  return isNSFW;
                })
              ).then((result) =>
                handleCreate(
                  images,
                  setImages,
                  setPosting,
                  result.includes(true)
                )
              );
            } else {
              handleCreate(images, setImages, setPosting);
            }
          }}
        >
          <Input
            className="w-auto mb-2"
            placeholder="Craft ur headline..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setTitle(e.target.value))
            }
            value={title}
            onFocus={() => setFocus(`title`)}
          />
          <div
            {...(!isDragActive && getRootProps())}
            onClick={(e) => e.preventDefault()}
            className="relative"
          >
            <Textarea
              style={{ height: `${height}` }}
              className="flex box-border resize-y overflow-hidden"
              placeholder="What's on your mind?"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                dispatch(setContent(e.target.value));
                setHeight(
                  e.target.value
                    ? e.currentTarget.scrollHeight.toString() + "px"
                    : "100%"
                );
              }}
              value={content}
              onFocus={() => setFocus(`content`)}
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
                          const filtered = images.filter((_, i) => i !== index);
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
              </div>
            )}
            {isDragActive && (
              <div
                {...getRootProps()}
                style={{ height: `${height}` }}
                className="absolute w-full min-h-[60px] top-0 bg-gray-700 opacity-75 text-2xl text-white flex justify-center items-center"
              >
                <h2>Drop here...</h2>
              </div>
            )}
          </div>

          <CardFooter className="px-0 pb-0 flex justify-between mt-4 items-end relative">
            <Button
              type="submit"
              className="text-base px-6"
              disabled={isPosting}
            >
              {isPosting && (
                <LoaderIcon className="animate-spin h-5 w-5 mr-1 mt-0.5" />
              )}
              {isPosting ? "Posting..." : "Post"}
            </Button>
            <EditorTools
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              focus={focus}
            />
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default PostEditor;
