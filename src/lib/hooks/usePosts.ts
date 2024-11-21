import {
  fetchPosts,
  selectContent,
  selectPosts,
  selectTitle,
  selectRecentPosts,
  selectPostsError,
  selectPending,
  selectCommentContent,
  selectActiveComments,
  selectActivePostId,
  insertPost,
  updatePostLikes,
  insertComment,
  setCommentContent,
} from "@/store/slices/posts-slice";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import { shallowEqual } from "react-redux";
import { AsyncFnType, useStateSetter } from "@/lib/types";
import { createToast } from "../utils";
import {
  addLikedPost,
  removeLikedPost,
  selectLikedPosts,
  selectLogged,
} from "@/store/slices/user-slice";
import { CLOUDINARY_KEY } from "../constants";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const recentPosts = useAppSelector(selectRecentPosts, shallowEqual);
  const content = useAppSelector(selectContent);
  const title = useAppSelector(selectTitle);
  const error = useAppSelector(selectPostsError);
  const isPending = useAppSelector(selectPending);
  const commentContent = useAppSelector(selectCommentContent);
  const activeComments = useAppSelector(selectActiveComments);
  const activeId = useAppSelector(selectActivePostId);
  const likedPosts = useAppSelector(selectLikedPosts);
  const isLogged = useAppSelector(selectLogged);

  const nav = useNavigate();

  const [isPosting, setPosting] = useState(false);

  const [isSending, setSending] = useState(false);

  const updatePosts = (f: AsyncFnType<unknown>) =>
    f().then(() => dispatch(fetchPosts()));

  const getImageLinks = async (images: string[]) => {
    const links: string[] = [];

    for (let img of images) {
      const formData = new FormData();

      formData.append("file", img);
      formData.append("upload_preset", "ml_default");
      formData.append("api_key", CLOUDINARY_KEY!);

      const data = await fetch(
        "https://api.cloudinary.com/v1_1/blow-project/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      links.push(data.url);
    }

    return { links };
  };

  const handleCreate = (
    e: FormEvent,
    images: string[],
    setImages: useStateSetter<string[]>
  ) => {
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

    if ((!content || !title.trim()) && !images.length) {
      createToast({
        text: "Fill all the fields!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (title.length > 50) {
      createToast({
        text: "Hey, chop your title down!",
        icon: "🪓",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (content.length > 2000) {
      createToast({
        text: "Hey, chop your content down!",
        icon: "🪓",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    setPosting(true);

    getImageLinks(images).then(({ links }) => {
      const f = async () => dispatch(insertPost(links));
      updatePosts(f);
      setImages([]);

      nav("/feed");
      setPosting(false);
    });
  };

  const handleCommentSubmit = async (
    e: FormEvent,
    images: string[],
    setImages: useStateSetter<string[]>
  ) => {
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

    if (!commentContent.trim() && !images.length) {
      createToast({
        text: "Fill all the fields!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (commentContent.length > 2000) {
      createToast({
        text: "Hey, chop your comment down!",
        icon: "🪓",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    setSending(true);

    getImageLinks(images).then(({ links }) => {
      dispatch(insertComment(links));
      dispatch(setCommentContent(""));
      setImages([]);
      setSending(false);
    });
  };

  const handlePostLike = (id: number, likes: number) => {
    if (!isLogged) {
      createToast({
        text: "Login first!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (!likedPosts.includes(id)) {
      const like = async () =>
        dispatch(updatePostLikes({ id: id, likes: likes + 1 }));

      dispatch(addLikedPost(id));
      updatePosts(like);

      createToast({ text: "Post liked!", icon: "❤️", color: "red" });
    } else {
      const dislike = async () =>
        dispatch(updatePostLikes({ id: id, likes: likes - 1 })).then();

      dispatch(removeLikedPost(id));
      updatePosts(dislike);
    }
  };

  return {
    recentPosts,
    posts,
    content,
    title,
    error,
    dispatch,
    handlePostLike,
    handleCreate,
    isPending,
    commentContent,
    activeComments,
    activeId,
    likedPosts,
    handleCommentSubmit,
    isPosting,
    isSending,
  };
};
