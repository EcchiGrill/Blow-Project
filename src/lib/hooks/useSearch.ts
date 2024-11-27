import { useEffect, useState } from "react";
import { useProfile } from "./useProfile";
import { usePosts } from "./usePosts";
import { FetchedPostsType, FetchedProfilesType } from "../types";

export const useSearch = () => {
  const { profiles } = useProfile();
  const { posts } = usePosts();
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>();
  const [result, setResult] = useState<{
    posts: FetchedPostsType | undefined;
    profiles: FetchedProfilesType;
  }>({
    posts,
    profiles,
  });

  useEffect(() => {
    if (!posts) return;

    setResult(() => {
      return {
        posts: posts.filter(
          (post) =>
            post.username
              ?.toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            post.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
            post.content?.toLowerCase().includes(search.trim().toLowerCase())
        ),
        profiles: profiles
          .filter((profile) =>
            profile.username
              ?.toLowerCase()
              .includes(search.trim().toLowerCase())
          )
          .sort(
            (a, b) =>
              posts.filter((p) => p.author === b.uid).length -
              posts.filter((p) => p.author === a.uid).length
          ),
      };
    });
  }, [search, posts, profiles]);

  return { result, open, search, setSearch, setOpen };
};
