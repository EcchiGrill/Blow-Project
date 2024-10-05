import { NavLink, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Mail,
  User,
  Search,
  Settings,
  Images,
  CassetteTape,
  Fan,
  Newspaper,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import NavItem from "./nav-item";
import { useUser } from "@/hooks/useUser";
import { useStateSetter } from "@/types";

const NavContent = ({ setOpen }: { setOpen?: useStateSetter<boolean> }) => {
  const location = useLocation();
  const { isLogged } = useUser();

  return (
    <div className="flex h-full flex-col bg-primary text-secondary lg:border-r lg:border-secondary">
      <div className="flex h-14 items-center border-b border-secondary px-4">
        <NavLink className="flex items-center gap-2 font-semibold" to="/">
          <Fan className="h-6 w-6" />
          <span>Blow Project</span>
        </NavLink>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary" />
            <Input
              className="pl-8"
              placeholder="Search..."
              type="search"
              tabIndex={-1}
            />
          </form>
          <nav className="flex flex-col gap-1">
            <NavItem Icon={Home} label="Home" to="/" />
            <NavItem Icon={Newspaper} label="Feed" to="feed" />
            <NavItem
              Icon={User}
              label={`${isLogged ? "Profile" : "Login"}`}
              to={`${isLogged ? "/profile" : "/login"}`}
              onClick={() => {
                if (!isLogged) setOpen!(false);
              }}
              state={!isLogged ? { login: location } : undefined}
            />
            <NavItem Icon={Mail} label="Messages" to="messages" />
            <NavItem Icon={Images} label="Gallery" to="gallery" />
            <NavItem Icon={CassetteTape} label="Music" to="music" />
            <NavItem Icon={Settings} label="Settings" to="settings" />
          </nav>
        </div>
      </ScrollArea>
      <div className="border-b border-secondary p-4">
        <p className="text-xs text-center text-secondary">
          © 2024 Blow Project. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NavContent;
