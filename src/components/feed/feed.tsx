import Friends from "./friends";
import Subscribtions from "./subscribtions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsFeed from "./posts-feed/posts-feed";
import { usePosts } from "@/lib/hooks/usePosts";
import PostEditor from "./posts-feed/post-editor";
import { useWindowScroll, useWindowSize } from "react-use";
import { useEffect, useRef, useState } from "react";
import { FEED_POSTS_COUNT, FEED_SCROLL_RENDERING } from "@/lib/constants";

function Feed() {
  const { posts, title, content } = usePosts();

  const { y } = useWindowScroll();
  const { height } = useWindowSize();

  const [postsCount, setPostsCount] = useState<number>(FEED_POSTS_COUNT);

  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHeight = y + height;
    const windowHeight = feedRef.current?.offsetParent?.clientHeight!;

    if (
      windowHeight - scrollHeight &&
      windowHeight - scrollHeight < FEED_SCROLL_RENDERING
    )
      setPostsCount((prev) => prev + FEED_POSTS_COUNT);
  }, [y]);

  return (
    <main className="w-inherit sm:container mx-auto px-4 py-8" ref={feedRef}>
      <Tabs defaultValue="posts" className="w-full 2xl:hidden">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts Feed</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" style={{ outline: 0 }}>
          <PostEditor title={title} content={content} />
          <PostsFeed posts={posts} postsCount={postsCount} />
        </TabsContent>
        <TabsContent value="subscriptions" style={{ outline: 0 }}>
          <Subscribtions />
        </TabsContent>
        <TabsContent value="friends" style={{ outline: 0 }}>
          <Friends />
        </TabsContent>
      </Tabs>
      <div className="w-full 2xl:flex flex-row gap-8 hidden">
        <Subscribtions className="h-full w-5/12" />
        <div className="w-8/12 3xl:max-w-10/12">
          <PostEditor title={title} content={content} />
          <PostsFeed posts={posts} postsCount={postsCount} />
        </div>
        <Friends className="h-full w-5/12" />
      </div>
    </main>
  );
}

export default Feed;
