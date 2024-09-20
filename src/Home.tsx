import { Profile } from "@/components/Profile";
import { Navmenu } from "./components/nav-menu";

function Home() {
  return (
    <div className="grid grid-cols-1/10fr">
      <Navmenu />
      <Profile />
    </div>
  );
}

export default Home;
