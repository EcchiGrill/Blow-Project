import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import {
  selectCommentContent,
  selectContent,
  selectTitle,
  setCommentContent,
  setContent,
  setTitle,
} from "@/store/slices/posts-slice";
import EmojiPicker from "emoji-picker-react";
import { ImagePlus, SmilePlus } from "lucide-react";
import { useState } from "react";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

function EditorTools({
  getRootProps,
  getInputProps,
  focus,
}: {
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  focus?: "title" | "content" | undefined;
}) {
  const dispatch = useAppDispatch();
  const content = useAppSelector(selectContent);
  const title = useAppSelector(selectTitle);
  const commentContent = useAppSelector(selectCommentContent);
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-4">
      <div
        onClick={() => setEmojiOpen((prev) => !prev)}
        className="cursor-pointer hover:opacity-80 transition duration-300 "
      >
        <span className="sr-only">Emojis</span>
        <SmilePlus className="h-7 w-7" />
      </div>
      <div
        {...getRootProps()}
        className="cursor-pointer hover:opacity-80 transition duration-300"
      >
        <Input {...getInputProps()} accept="image/*" />
        <span className="sr-only">Load Image</span>
        <ImagePlus className="h-7 w-7" />
      </div>
      <EmojiPicker
        open={emojiOpen}
        //@ts-expect-error theme
        theme="auto"
        onEmojiClick={(e) => {
          if (focus) {
            switch (focus) {
              case "content":
                dispatch(setContent(content + e.emoji));
                break;

              case "title":
                dispatch(setTitle(title + e.emoji));
                break;

              default:
                break;
            }
          } else {
            dispatch(setCommentContent(commentContent + e.emoji));
          }
        }}
        skinTonesDisabled
        style={{
          position: "absolute",
          top: "3rem",
          right: "-2rem",
          zIndex: 20,
          padding: "5px",
        }}
      />
    </div>
  );
}

export default EditorTools;
