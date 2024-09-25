import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "supabase/db.types";

function getFetchedPostType(db: Database) {
  return db.public.Tables.posts.Row;
}

type FetchedPostType = ReturnType<typeof getFetchedPostType>;

type FetchedPostsType = FetchedPostType[];

type errorType = Partial<PostgrestError>;

interface InitialState {
  fetchedPosts?: FetchedPostsType;
  error?: errorType;
  title?: string;
  content?: string;
}

const parseDate = (dateString: string): Date =>
  new Date(Date.parse(dateString));

const filterDate = (post: FetchedPostType) => {
  const parsedDate = parseDate(post.date);
  const milliseconds = Date.now() - parsedDate.getTime();
  const seconds = Math.trunc(milliseconds / 1000);
  const minutes = Math.trunc(seconds / 60);
  const hours = Math.trunc(minutes / 60);
  const days = Math.trunc(hours / 24);

  if (days >= 1) {
    return (post.date = `${days} days ago`);
  } else if (hours >= 1) {
    return (post.date = `${hours} hours ago`);
  } else if (minutes >= 1) {
    return (post.date = `${minutes} minutes ago`);
  } else {
    return (post.date = `${seconds} seconds ago`);
  }
};

const initialState: InitialState = {};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<FetchedPostsType>) => {
      const sortedPosts = action.payload.sort(
        (post1, post2) =>
          parseDate(post2.date).getTime() - parseDate(post1.date).getTime()
      );
      const filteredPosts = sortedPosts.filter((post) => filterDate(post));

      return {
        ...state,
        fetchedPosts: filteredPosts,
      };
    },
    setContent: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        content: action.payload,
      };
    },
    setTitle: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        title: action.payload,
      };
    },
    setError: (state, action: PayloadAction<errorType>) => {
      return { ...state, error: action.payload };
    },
  },
});

export const { setPosts, setContent, setTitle, setError } = postsSlice.actions;

export default postsSlice.reducer;
