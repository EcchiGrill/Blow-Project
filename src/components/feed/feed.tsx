import Friends from "./friends";
import Subscribtions from "./subscribtions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsFeed from "./posts-feed";

function Feed() {
  return (
    <main className="w-inherit sm:container mx-auto px-4 py-8">
      <Tabs defaultValue="posts" className="w-full 2xl:hidden">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts Feed</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <PostsFeed />
        </TabsContent>
        <TabsContent value="subscriptions">
          <Subscribtions />
        </TabsContent>
        <TabsContent value="friends">
          <Friends />
        </TabsContent>
      </Tabs>
      <div className="w-full 2xl:flex flex-row gap-8 hidden">
        <Subscribtions className="h-full w-5/12" />
        <PostsFeed className="w-8/12 3xl:w-10/12" />
        <Friends className="h-full w-5/12" />
      </div>
    </main>
  );
}

export default Feed;
