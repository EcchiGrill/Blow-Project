import { Command, CommandList } from "@/components/ui/command";
import { Input } from "../ui/input";
import { Search, XIcon } from "lucide-react";
import { useSearch } from "@/lib/hooks/useSearch";
import { NavLink } from "react-router-dom";
import { useClickAway } from "react-use";
import { useRef } from "react";

function Header() {
  const { result, search, open, setOpen, setSearch } = useSearch();
  const searchRef = useRef(null);

  useClickAway(searchRef, () => {
    setOpen(false);
  });

  return (
    <header className="w-full py-12 md:py-24 lg:py-32 text-secondary">
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl text-secondary-title font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to Blow Project
            </h1>
            <p className="mx-auto max-w-[700px] text-secondary md:text-xl">
              Discover insightful articles on technology, design, and more.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2 relative" ref={searchRef}>
            <div className="flex place-items-center">
              <Search className="h-4 w-4 absolute left-2" />
              <Input
                className="pl-8"
                placeholder="Search users, posts..."
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpen(true);
                }}
                value={search}
              />
              {open && (
                <XIcon
                  className="h-4 w-4 absolute right-2 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              )}
            </div>

            {open && (
              <div className="absolute w-full z-30 text-start ">
                <Command>
                  <CommandList className="text-secondary">
                    {result.profiles.length ? (
                      <div className="px-2 flex flex-col py-2">
                        <span className="text-xs pl-2 text-secondary-title mb-1.5 font-semibold">
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
                                    onClick={() => setOpen(false)}
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
                                  onClick={() => setOpen(false)}
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
                        <span className="text-xs pl-2 text-secondary-title  mb-1.5 font-semibold">
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
                                    onClick={() => setOpen(false)}
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
                                  onClick={() => setOpen(false)}
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
                    <div className="text-xl text-center p-6 text-error">
                      Results not found
                    </div>
                  ) : (
                    ""
                  )}
                </Command>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
