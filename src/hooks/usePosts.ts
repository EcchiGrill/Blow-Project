import { setError, setPosts } from "@/store/slices/postsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store-hooks";
import { useEffect } from "react";
import supabase from "../../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const posts = useAppSelector((state) => state.posts.fetchedPosts);
  const content = useAppSelector((state) => state.posts.content);
  const title = useAppSelector((state) => state.posts.title);
  const user = useAppSelector((state) => state.user);
  const error = useAppSelector((state) => state.posts.error);

  const addPost = async () => {
    if (!content || !title) {
      dispatch(setError({ message: "Please fill in all the fields" }));
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([{ author: user.username, title: title, content: content }])
      .select();

    if (error) {
      console.log(error);
      dispatch(setError(error));
    }

    if (data) {
      dispatch(setPosts(data));
      navigate(0);
    }
  };

  const likePost = async (id: number, likes: number) => {
    const { data, error } = await supabase
      .from("posts")
      .update({ likes: likes + 1 })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
      dispatch(setError(error));
    }

    if (data) {
      dispatch(setPosts(data));
      navigate(0);
    }
  };

  useEffect(() => {
    const getPosts = async () => {
      const { data, error } = await supabase.from("posts").select();

      if (error) {
        console.log(error);
        dispatch(setError(error));
      }

      if (data) {
        dispatch(setPosts(data));
      }
    };

    getPosts();
  }, [dispatch]);

  return {
    posts,
    content,
    title,
    error,
    addPost,
    likePost,
    dispatch,
  };
};
