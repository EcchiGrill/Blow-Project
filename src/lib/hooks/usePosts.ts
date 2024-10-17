import {
  fetchPosts,
  addLike,
  selectContent,
  selectPosts,
  selectTitle,
  addPost,
  selectRecentPosts,
  selectPostsError,
} from "@/store/slices/posts-slice";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import { shallowEqual } from "react-redux";
import { AsyncFnType } from "@/lib/types";
import { useEffect } from "react";
import { useUser } from "./useUser";
import { createToast } from "../utils";

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const recentPosts = useAppSelector(selectRecentPosts, shallowEqual);
  const content = useAppSelector(selectContent);
  const title = useAppSelector(selectTitle);
  const error = useAppSelector(selectPostsError);

  const { isLogged } = useUser();

  const updatePosts = (f: AsyncFnType<unknown>) =>
    f().then(() => dispatch(fetchPosts()));

  const createPost = () => {
    if (!content || !title) {
      createToast({
        text: "Fill all the fields!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (!isLogged) {
      createToast({
        text: "Login first!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    const f = async () => dispatch(addPost());
    updatePosts(f);
  };

  const likePost = (id: number, likes: number) => {
    if (!isLogged) {
      createToast({
        text: "Login first!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }
    const f = async () => dispatch(addLike({ id: id, likes: likes }));
    updatePosts(f);
  };

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return {
    recentPosts,
    posts,
    content,
    title,
    error,
    dispatch,
    likePost,
    createPost,
  };
};
