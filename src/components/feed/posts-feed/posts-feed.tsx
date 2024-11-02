import { usePosts } from "@/lib/hooks/usePosts";
import { fetchComments, fetchPosts } from "@/store/slices/posts-slice";
import { useEffect } from "react";
import { useRef } from "react";
import CreatePost from "./create-post";
import Post from "./post/post";

function PostsFeed({ className }: { className?: string }) {
  const {
    dispatch,
    posts,
    error,
    activeId,
    handlePostLike,
    createPost,
    title,
    content,
    isPending,
  } = usePosts();

  useEffect(() => {
    dispatch(fetchPosts());
    if (activeId) dispatch(fetchComments());
  }, [dispatch, activeId]);

  const scrollRef = useRef(null);
  // const { x, y } = useScroll(scrollRef);

  // console.log(x, y);

  return (
    <div className={className} ref={scrollRef}>
      <CreatePost createPost={createPost} title={title} content={content} />
      {error && <p className="text-lg mt-4 text-center text-error">{error}</p>}
      {posts && (
        <div className="mt-6 space-y-6">
          {posts.map((post) => (
            <Post
              post={post}
              handleLike={handlePostLike}
              key={post.id}
              activeId={activeId}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default PostsFeed;
