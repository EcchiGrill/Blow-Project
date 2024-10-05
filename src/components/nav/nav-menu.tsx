import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavContent from "./nav-content/nav-content";

function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden min-h-screen w-64 lg:block">
        <NavContent setOpen={setOpen} />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTitle className="sr-only">Menu</SheetTitle>
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
          <SheetDescription className="hidden" />
          <NavContent setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default NavMenu;
