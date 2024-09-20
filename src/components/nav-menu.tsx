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
} from "lucide-react";

export function Navmenu() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: Images, label: "Gallery", href: "/gallery" },
    { icon: CassetteTape, label: "Music", href: "/music" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const NavContent = () => (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        <a className="flex items-center gap-2 font-semibold" href="/">
          <Fan className="h-6 w-6" />
          <span>Blow Project</span>
        </a>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              className="w-full appearance-none rounded-md border border-gray-800 bg-gray-950 py-2 pl-8 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="Search..."
              type="search"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-900 hover:text-white"
                href={item.href}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </ScrollArea>
      <div className="border-t border-gray-800 p-4">
        <p className="text-xs text-gray-400">
          © 2024 Blow Project. All rights reserved.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-screen w-64 lg:block">
        <NavContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <Menu className="h-6 w-6" />
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
