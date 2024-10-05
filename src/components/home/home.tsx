import Header from "./header";
import ActiveUsers from "./active-users";
import RecentPosts from "./recent-posts";
import Footer from "./footer";

function Home() {
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
