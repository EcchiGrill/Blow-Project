import { usePosts } from "@/lib/hooks/usePosts";
import { fetchComments, fetchPosts } from "@/store/slices/posts-slice";
import { useEffect, useMemo } from "react";
import Post from "./post/post";
import { FetchedPostsType } from "@/lib/types";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CornerDownRight } from "lucide-react";
import supabase from "@/supabase/supabase-client";

function PostsFeed({
  posts,
  postsCount = posts?.length,
  imgClassName = "",
}: {
  posts: FetchedPostsType | undefined;
  postsCount?: number;
  imgClassName?: string;
}) {
  const { dispatch, error, activeId, handlePostLike, isPending } = usePosts();

  const { postlink } = useParams();

  const nav = useNavigate();

  const getPosts = useMemo(() => {
    if (postlink && postlink.startsWith("post-")) {
      const link = postlink.slice(5);

      return posts?.find((post) => post.id.toString() === link) ? (
        <>
          {posts?.map(
            (post) =>
              post.id.toString() === link && (
                <Post
                  post={post}
                  handleLike={handlePostLike}
                  key={post.id}
                  activeId={activeId}
                  isPending={isPending}
                  imgClassName={imgClassName}
                />
              )
          )}
          <div className="text-center">
            <Button
              type="button"
              variant="secondary"
              className="px-10"
              onClick={() => nav("/feed")}
            >
              Show More
            </Button>
          </div>
        </>
      ) : (
        <div className="text-3xl text-center text-error flex flex-col gap-2">
          Post not found
          <div className="flex place-content-center">
            <NavLink
              to="/feed"
              style={{ outline: 0 }}
              className="text-secondary underline flex gap-1 hover:opacity-80 duration-300 transition place-content-center text-2xl w-max"
            >
              Go back
              <CornerDownRight className="text-xl self-end" />
            </NavLink>
          </div>
        </div>
      );
    } else {
      return posts?.map(
        (post, i) =>
          i < postsCount! && (
            <Post
              post={post}
              handleLike={handlePostLike}
              key={post.id}
              activeId={activeId}
              isPending={isPending}
              imgClassName={imgClassName}
            />
          )
      );
    }
  }, [posts, isPending, postlink, postsCount]);

  useEffect(() => {
    dispatch(fetchPosts());
    if (activeId) dispatch(fetchComments());
    supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          dispatch(fetchPosts());
        }
      )
      .subscribe();
  }, [dispatch, activeId]);

  return (
    <div>
      {error && <p className="text-lg mt-4 text-center text-error">{error}</p>}
      {posts && <div className="mt-6 space-y-6">{getPosts}</div>}
    </div>
  );
}
export default PostsFeed;
