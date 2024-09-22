import { Outlet } from "react-router-dom";
import { Navmenu } from "@/components/nav-menu";

function App() {
  return (
    <div className="grid h-full max-lg:w-screen lg:grid-cols-1/10fr">
      <Navmenu />
      <Outlet />
    </div>
  );
}

export default App;
