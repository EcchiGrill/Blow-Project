import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { FetchedPostsType, IAddLike, IPosts, IUser } from "@/types";
import {
  createSlice,
  createToast,
  filterDate,
  getError,
  parseDate,
} from "../store-funcs";

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
        fulfilled: (state, action) => {
          state.UIError = null;
          const sortedPosts = (
            action as PayloadAction<FetchedPostsType>
          ).payload.sort(
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
                author: user.data.fullName,
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
          state.UIError = null;
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
          state.UIError = null;
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
  }),
  selectors: {
    selectRecentPosts: (state) => state.fetchedPosts?.slice(0, 6),
    selectPosts: (state) => state.fetchedPosts,
    selectUIError: (state) => state.UIError,
    selectContent: (state) => state.insertPost?.content,
    selectTitle: (state) => state.insertPost?.title,
  },
});

export const {
  selectRecentPosts,
  selectPosts,
  selectUIError,
  selectTitle,
  selectContent,
} = postsSlice.selectors;

export const { setContent, setTitle, setError, fetchPosts, addPost, addLike } =
  postsSlice.actions;

export default postsSlice.reducer;
