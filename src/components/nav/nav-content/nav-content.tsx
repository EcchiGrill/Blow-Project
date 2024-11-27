import { NavLink, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Mail,
  User,
  Settings,
  Images,
  CassetteTape,
  Fan,
  Newspaper,
  Activity,
  Search,
} from "lucide-react";
import NavItem from "./nav-item";
import { useUser } from "@/lib/hooks/useUser";
import { useStateSetter } from "@/lib/types";
import { useContext } from "react";
import { ActivityContext } from "@/context/activity-provider";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/lib/hooks/useSearch";

const NavContent = ({
  setNavOpen,
}: {
  setNavOpen?: useStateSetter<boolean>;
}) => {
  const location = useLocation();
  const { isLogged } = useUser();
  const { result, search, open, setOpen, setSearch } = useSearch();
  const activeUsers = useContext(ActivityContext);

  return (
    <div className="flex h-full flex-col bg-primary text-secondary lg:border-r lg:border-secondary">
      <div className="flex h-14 items-center border-b border-secondary px-4 justify-between text-secondary-title ">
        <div>
          <NavLink className="flex items-center gap-2 font-semibold" to="/">
            <Fan className="h-6 w-6" />
            <span>Blow</span>
          </NavLink>
        </div>
        <div className="flex flex-row gap-2 font-semibold">
          Online:
          <span className="text-green-700 flex flex-row items-center gap-1">
            {activeUsers.length} <Activity className="w-4 h-4 mt-0.5" />
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary" />
            <Input
              className="pl-8"
              style={{ outline: 0 }}
              placeholder="Search..."
              type="search"
              tabIndex={-1}
              onChange={(e) => {
                setSearch(e.target.value);
                e.target.value ? setOpen(true) : setOpen(false);
              }}
              value={search}
            />
          </div>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
              className="focus:outline-0"
              autoFocus={true}
              placeholder="Search users, posts..."
              onValueChange={(e) => {
                setSearch(e);
              }}
              value={search}
            />
            <CommandList className="text-secondary">
              {result.profiles.length ? (
                <div className="px-2 flex flex-col py-2">
                  <span className="text-xs pl-2 text-secondary-title mb-1.5">
                    Profiles
                  </span>
                  {!search
                    ? result.profiles?.map(
                        (profile, i) =>
                          i < 2 && (
                            <NavLink
                              to={`/profile/${profile.link}`}
                              key={profile.uid}
                              style={{ outline: 0 }}
                              onClick={() => {
                                setOpen(false);
                                setNavOpen!(false);
                              }}
                              className="cursor-pointer flex justify-between select-none items-center rounded-sm px-2 py-3 text-sm hover:bg-secondary hover:text-primary transition"
                            >
                              <span>{profile.username}</span>
                            </NavLink>
                          )
                      )
                    : result.profiles?.map((profile) => {
                        return (
                          <NavLink
                            to={`/profile/${profile.link}`}
                            key={profile.uid}
                            style={{ outline: 0 }}
                            onClick={() => {
                              setOpen(false);
                              setNavOpen!(false);
                            }}
                            className="cursor-pointer flex justify-between select-none items-center rounded-sm px-2 py-2.5 text-sm hover:bg-secondary hover:text-primary transition"
                          >
                            <span>{profile.username}</span>
                          </NavLink>
                        );
                      })}
                </div>
              ) : (
                ""
              )}

              {result.posts?.length ? (
                <div className="px-2 flex flex-col py-2">
                  <span className="text-xs pl-2 text-secondary-title mb-1.5">
                    Posts
                  </span>

                  {!search
                    ? result.posts?.map(
                        (post, i) =>
                          i < 3 && (
                            <NavLink
                              to={`/feed/post-${post.id}`}
                              key={post.id}
                              style={{ outline: 0 }}
                              onClick={() => {
                                setOpen(false);
                                setNavOpen!(false);
                              }}
                              className="cursor-pointer flex justify-between select-none items-center rounded-sm px-2 py-3 text-sm hover:bg-secondary hover:text-primary transition"
                            >
                              <span>{post.title}</span>
                              <span>{post.username}</span>
                            </NavLink>
                          )
                      )
                    : result.posts?.map((post) => {
                        return (
                          <NavLink
                            to={`/feed/post-${post.id}`}
                            key={post.id}
                            style={{ outline: 0 }}
                            onClick={() => {
                              setOpen(false);
                              setNavOpen!(false);
                            }}
                            className="cursor-pointer flex justify-between select-none items-center rounded-sm px-2 py-2.5 text-sm hover:bg-secondary hover:text-primary transition"
                          >
                            <span>{post.title}</span>
                            <span>{post.username}</span>
                          </NavLink>
                        );
                      })}
                </div>
              ) : (
                ""
              )}
            </CommandList>
            {!result.posts?.length && !result.profiles.length ? (
              <div className="text-xl text-center p-12 text-error">
                Results not found
              </div>
            ) : (
              ""
            )}
          </CommandDialog>

          <nav className="flex flex-col gap-1 ">
            <NavItem Icon={Home} label="Home" to="/" />
            <NavItem Icon={Newspaper} label="Feed" to="feed" />
            <NavItem
              Icon={User}
              label={`${isLogged ? "Profile" : "Login"}`}
              to={`${isLogged ? "/profile" : "/login"}`}
              onClick={() => {
                if (!isLogged) setNavOpen!(false);
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
