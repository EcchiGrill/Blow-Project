import Header from "./header";
import RecentPosts from "./recent-posts";
import { useEffect } from "react";
import { fetchPosts } from "@/store/slices/posts-slice";
import { useAppDispatch } from "@/store/lib/store-hooks";
import UsersLeaderboard from "./users-leaderboard";

function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <main className="flex flex-col min-h-screen place-items-center">
      <div className="flex-1">
        <Header />
        <UsersLeaderboard />
        <RecentPosts />
        {/* <Footer /> */}
      </div>
    </main>
  );
}

export default Home;
