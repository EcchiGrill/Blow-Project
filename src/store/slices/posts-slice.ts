import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { FetchedPostsType, IAddLike, IPosts, IUser } from "@/lib/types";
import {
  createSlice,
  filterDate,
  getError,
  parseDate,
} from "../lib/store-utils";
import { createToast } from "@/lib/utils";

const initialState: IPosts = {
  insertPost: {
    title: "",
    content: "",
  },
  maintain: {},
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: (create) => ({
    fetchPosts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { data, error } = await supabase.from("posts").select();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (e) {
          return rejectWithValue(e);
        }
      },
      {
        fulfilled: (state, action: PayloadAction<FetchedPostsType>) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;

          const sortedPosts = action.payload.sort(
            (post1, post2) =>
              parseDate(post2.date).getTime() - parseDate(post1.date).getTime()
          );
          const filteredPosts = sortedPosts.filter((post) => filterDate(post));
          state.fetchedPosts = filteredPosts;
        },
        pending: (state) => {
          state.maintain.status = "pending";
        },
        rejected: (state, action) => {
          getError<IPosts>(state, action);
        },
      }
    ),

    addPost: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { posts, user } = getState() as {
            posts: IPosts;
            user: IUser;
          };

          const { data, error } = await supabase
            .from("posts")
            .insert([
              {
                author: user.data.username,
                title: posts.insertPost?.title,
                content: posts.insertPost?.content,
              },
            ])
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;
          state.insertPost.title = "";
          state.insertPost.content = "";

          createToast({ text: "Post added!", icon: "📄" });
        },
        pending: (state) => {
          state.maintain.status = "pending";
        },
        rejected: (state, action) => {
          getError<IPosts>(state, action);
        },
      }
    ),

    addLike: create.asyncThunk(
      async ({ id, likes }: IAddLike, { rejectWithValue }) => {
        try {
          const { data, error } = await supabase
            .from("posts")
            .update({ likes: likes + 1 })
            .eq("id", id)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state) => {
          state.maintain.status = "fulfilled";
          state.UIError = null;
          state.maintain.error = null;
          createToast({ text: "Post liked!", icon: "❤️", color: "red" });
        },
        pending: (state) => {
          state.maintain.status = "pending";
        },
        rejected: (state, action) => {
          getError<IPosts>(state, action);
        },
      }
    ),

    setContent: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        insertPost: {
          ...state.insertPost,
          content: action.payload,
        },
      };
    }),

    setTitle: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        insertPost: {
          ...state.insertPost,
          title: action.payload,
        },
      };
    }),

    setError: create.reducer((state, action: PayloadAction<string>) => {
      return {
        ...state,
        UIError: action.payload,
      };
    }),
  }),
  selectors: {
    selectRecentPosts: (state) => state.fetchedPosts?.slice(0, 6),
    selectPosts: (state) => state.fetchedPosts,
    selectPostsError: (state) => state.UIError,
    selectContent: (state) => state.insertPost?.content,
    selectTitle: (state) => state.insertPost?.title,
  },
});

export const {
  selectRecentPosts,
  selectPosts,
  selectPostsError,
  selectTitle,
  selectContent,
} = postsSlice.selectors;

export const { setContent, setTitle, setError, fetchPosts, addPost, addLike } =
  postsSlice.actions;

export default postsSlice.reducer;
