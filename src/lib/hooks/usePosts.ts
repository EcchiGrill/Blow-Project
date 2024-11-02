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
} from "@/store/slices/posts-slice";
import { useAppDispatch, useAppSelector } from "@/store/lib/store-hooks";
import { shallowEqual } from "react-redux";
import { AsyncFnType } from "@/lib/types";
import { createToast } from "../utils";
import {
  addLikedPost,
  removeLikedPost,
  selectLikedPosts,
  selectLogged,
} from "@/store/slices/user-slice";

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

  const updatePosts = (f: AsyncFnType<unknown>) =>
    f().then(() => dispatch(fetchPosts()));

  const createPost = () => {
    if (!isLogged) {
      createToast({
        text: "Login first!",
        icon: "🔴",
        color: "red",
        pos: "top-center",
      });
      return;
    }

    if (!content || !title) {
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

    const f = async () => dispatch(insertPost());
    updatePosts(f);
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
    createPost,
    isPending,
    commentContent,
    activeComments,
    activeId,
    likedPosts,
  };
};
