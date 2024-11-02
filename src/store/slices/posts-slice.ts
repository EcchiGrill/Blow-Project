import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import {
  FetchedCommentsType,
  FetchedCommentType,
  FetchedPostsType,
  ICommentLike,
  IFulfillActivePosts,
  IPostLike,
  IPosts,
  IUser,
} from "@/lib/types";
import { createSlice, getError, handleFulfill } from "../lib/store-utils";
import { createToast, parseDate } from "@/lib/utils";

const initialState: IPosts = {
  insertPost: {
    title: "",
    content: "",
  },
  insertComment: {
    content: "",
  },
  comments: {
    activePostId: null,
    activeComments: null,
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
          handleFulfill(state);

          const sortedPosts = action.payload.sort(
            (post1, post2) =>
              parseDate(post2.date).getTime() - parseDate(post1.date).getTime()
          );

          state.fetchedPosts = sortedPosts;
        },
        pending: (state) => {
          state.maintain.status = "pending";
        },
        rejected: (state, action) => {
          getError<IPosts>(state, action);
        },
      }
    ),

    insertPost: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { posts, user } = getState() as {
            posts: IPosts;
            user: IUser;
          };

          const { error } = await supabase.from("posts").insert([
            {
              avatar: user.data.avatar,
              author: user.data.username,
              title: posts.insertPost?.title,
              content: posts.insertPost?.content,
            },
          ]);

          if (error) {
            throw new Error(error.message);
          }
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state) => {
          handleFulfill(state);

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

    updatePostLikes: create.asyncThunk(
      async ({ id, likes }: IPostLike, { getState, rejectWithValue }) => {
        try {
          const { user } = getState() as {
            user: IUser;
          };

          const { error } = await supabase
            .from("posts")
            .update({ likes: likes })
            .eq("id", id!);

          await supabase.auth.updateUser({
            data: {
              likedPosts: user.data.likedPosts,
            },
          });

          if (error) {
            throw new Error(error.message);
          }
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state) => {
          handleFulfill(state);
        },
        pending: (state) => {
          state.maintain.status = "pending";
        },
        rejected: (state, action) => {
          getError<IPosts>(state, action);
        },
      }
    ),

    updateCommentLikes: create.asyncThunk(
      async ({ id, likes }: ICommentLike, { getState, rejectWithValue }) => {
        try {
          const { user, posts } = getState() as {
            user: IUser;
            posts: IPosts;
          };

          if (!posts.comments.activeComments) throw new Error();

          const { data, error } = await supabase
            .from("posts")
            .select()
            .eq("id", posts.comments.activePostId!);

          const index = data![0].comments.findIndex(
            (comment) => comment.id === id
          );

          data![0].comments[index].likes = likes;

          await supabase
            .from("posts")
            .update({
              comments: data![0].comments,
            })
            .eq("id", posts.comments.activePostId!);

          await supabase.auth.updateUser({
            data: {
              likedComments: user.data.likedComments,
            },
          });

          if (error) {
            throw new Error(error.message);
          }
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state) => {
          handleFulfill(state);
        },
        pending: (state) => {
          state.maintain.status = "pending";
        },
        rejected: (state, action) => {
          getError<IPosts>(state, action);
        },
      }
    ),

    fetchComments: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { posts } = getState() as {
            posts: IPosts;
          };

          if (!posts.comments.activePostId) throw new Error();

          const { data, error } = await supabase
            .from("posts")
            .select()
            .eq("id", posts.comments.activePostId);

          if (error) {
            throw new Error(error.message);
          }

          return {
            activeId: posts.comments.activePostId,
            comments: data[0].comments,
          };
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action: PayloadAction<IFulfillActivePosts>) => {
          handleFulfill(state);
          state.fetchedPosts?.filter((post) => {
            if (post.id === action.payload.activeId)
              post.comments = action.payload.comments;
          });
          state.comments.activeComments = action.payload.comments;
        },
        pending: (state) => {
          state.maintain.status = "pending";
        },
        rejected: (state, action) => {
          getError<IPosts>(state, action);
        },
      }
    ),

    insertComment: create.asyncThunk(
      async (_, { getState, rejectWithValue }) => {
        try {
          const { posts, user } = getState() as {
            posts: IPosts;
            user: IUser;
          };

          if (!posts.comments.activePostId) throw new Error();

          const comment: FetchedCommentType = {
            id: self.crypto.randomUUID().toString(),
            author: user.data.username,
            avatar: user.data.avatar,
            content: posts.insertComment.content,
            timestamp: new Date().toISOString(),
            likes: 0,
          };

          const comments = posts.comments.activeComments
            ? posts.comments.activeComments.concat(comment)
            : [comment];

          const { data, error } = await supabase
            .from("posts")
            .update({
              comments: comments,
            })
            .eq("id", posts.comments.activePostId)
            .select();

          if (error) {
            throw new Error(error.message);
          }

          return {
            activeId: posts.comments.activePostId,
            comments: data[0].comments,
          };
        } catch (error) {
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action: PayloadAction<IFulfillActivePosts>) => {
          handleFulfill(state);
          state.fetchedPosts?.filter((post) => {
            if (post.id === action.payload.activeId)
              post.comments = action.payload.comments;
          });
          state.comments.activeComments = action.payload.comments;
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

    setActiveComments: create.reducer(
      (state, action: PayloadAction<FetchedCommentsType | null>) => {
        return {
          ...state,
          comments: {
            ...state.comments,
            activeComments: action.payload,
          },
        };
      }
    ),

    setActiveCommentLike: create.reducer(
      (state, action: PayloadAction<{ id: string; likes: number }>) => {
        return {
          ...state,
          comments: {
            ...state.comments,
            activeComments: state.comments.activeComments!.filter((comment) => {
              if (comment.id === action.payload.id)
                comment.likes = action.payload.likes;
            }),
          },
        };
      }
    ),

    setActivePostId: create.reducer(
      (state, action: PayloadAction<number | null>) => {
        return {
          ...state,
          comments: {
            ...state.comments,
            activePostId: action.payload,
          },
        };
      }
    ),

    setCommentContent: create.reducer(
      (state, action: PayloadAction<string>) => {
        return {
          ...state,
          insertComment: {
            ...state.insertComment,
            content: action.payload,
          },
        };
      }
    ),

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
    selectPending: (state) =>
      state.maintain.status === "pending" ? true : false,
    selectActiveComments: (state) => state.comments.activeComments,
    selectCommentContent: (state) => state.insertComment.content,
    selectActivePostId: (state) => state.comments.activePostId,
  },
});

export const {
  selectRecentPosts,
  selectPosts,
  selectPostsError,
  selectTitle,
  selectContent,
  selectPending,
  selectActiveComments,
  selectCommentContent,
  selectActivePostId,
} = postsSlice.selectors;

export const {
  setContent,
  setTitle,
  setError,
  fetchPosts,
  insertPost,
  updatePostLikes,
  updateCommentLikes,
  fetchComments,
  setCommentContent,
  insertComment,
  setActivePostId,
  setActiveComments,
  setActiveCommentLike,
} = postsSlice.actions;

export default postsSlice.reducer;
