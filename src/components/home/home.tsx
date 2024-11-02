import Header from "./header";
import ActiveUsers from "./active-users";
import RecentPosts from "./recent-posts";
import Footer from "./footer";
import { useEffect } from "react";
import { fetchPosts } from "@/store/slices/posts-slice";
import { useAppDispatch } from "@/store/lib/store-hooks";

function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <main className="flex flex-col min-h-screen place-items-center">
      <div className="flex-1">
        <Header />
        <ActiveUsers />
        <RecentPosts />
        <Footer />
      </div>
    </main>
  );
}

export default Home;
