import {
  fetchPosts,
  addLike,
  selectContent,
  selectUIError,
  selectPosts,
  selectTitle,
  addPost,
  selectRecentPosts,
  setError,
} from "@/store/slices/posts-slice";
import { useAppDispatch, useAppSelector } from "@/store/store-hooks";
import { shallowEqual } from "react-redux";
import { AsyncFnType } from "@/types";
import { useEffect } from "react";

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const recentPosts = useAppSelector(selectRecentPosts, shallowEqual);
  const content = useAppSelector(selectContent);
  const title = useAppSelector(selectTitle);
  const error = useAppSelector(selectUIError);

  const updatePosts = (f: AsyncFnType<unknown>) =>
    f().then(() => dispatch(fetchPosts()));

  const createPost = () => {
    if (!content || !title) {
      dispatch(setError("Fill all the fields!"));
      return;
    }
    const f = async () => dispatch(addPost());
    updatePosts(f);
  };

  const likePost = (id: number, likes: number) => {
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
