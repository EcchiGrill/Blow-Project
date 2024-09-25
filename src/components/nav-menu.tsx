import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Mail,
  Menu,
  User,
  Search,
  Settings,
  Images,
  CassetteTape,
  Fan,
  Newspaper,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/store-hooks";
import { login } from "@/store/slices/userSlice";

export function Navmenu() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector((state) => state.user.isLogged);

  const menuItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Newspaper, label: "Feed", to: "/feed" },
    {
      icon: User,
      label: isLogged ? "Profile" : "Login",
      to: isLogged ? "/profile" : "/Login",
      action: dispatch(login(true)),
    },
    { icon: Mail, label: "Messages", to: "/messages" },
    { icon: Images, label: "Gallery", to: "/gallery" },
    { icon: CassetteTape, label: "Music", to: "/music" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const NavContent = () => (
    <div className="flex h-full flex-col bg-primary text-secondary lg:border-r lg:border-secondary">
      <div className="flex h-14 items-center border-b border-secondary px-4">
        <NavLink className="flex items-center gap-2 font-semibold" to="/">
          <Fan className="h-6 w-6" />
          <span>Blow Project</span>
        </NavLink>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <form className="relative ">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary" />
            <Input className="pl-8" placeholder="Search..." type="search" />
          </form>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                className={({ isActive }: { isActive: boolean }): string => {
                  const cn =
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-secondary hover:text-primary";
                  return isActive
                    ? "bg-secondary text-primary " + cn
                    : "text-secondary " + cn;
                }}
                to={item.to}
                onClick={() => item.action}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
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

  return (
    <>
      <aside className="hidden min-h-screen w-64 lg:block">
        <NavContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className="lg:hidden rounded-none ml-3 mt-4"
            size="icon"
            variant="ghost"
          >
            <Menu className="h-6 w-6 text-secondary" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-64 p-0" side="left">
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
