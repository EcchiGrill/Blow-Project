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
          const posts = await (await supabase.from("posts").select()).data;

          const profiles = await (
            await supabase.from("profiles").select()
          ).data;

          if (!posts || !profiles) {
            throw new Error();
          }

          const data = posts.map((post) => {
            const filtered = profiles.find(
              (profile) => profile.uid === post.author
            );

            post.username = filtered?.username;
            post.avatar = filtered?.avatar;
            post.link = filtered?.link;

            post.comments = post.comments.map((comment) => {
              const filtered = profiles.find(
                (profile) => profile.uid === comment.author
              );

              comment.username = filtered?.username;
              comment.avatar = filtered?.avatar;
              comment.link = filtered?.link;

              return comment;
            });

            return post;
          });

          const sortedPosts = data.sort(
            (post1, post2) =>
              parseDate(post2.date).getTime() - parseDate(post1.date).getTime()
          );

          return sortedPosts;
        } catch (e) {
          return rejectWithValue(e);
        }
      },
      {
        fulfilled: (state, action: PayloadAction<FetchedPostsType>) => {
          handleFulfill(state);
          state.fetchedPosts = action.payload;
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
      async (image: string[], { getState, rejectWithValue }) => {
        try {
          const { posts, user } = getState() as {
            posts: IPosts;
            user: IUser;
          };

          const { data, error } = await supabase
            .from("posts")
            .insert([
              {
                author: user.data.uid,
                title: posts.insertPost?.title,
                content: posts.insertPost?.content,
                image: image,
              },
            ])
            .select();

          if (!data || error) {
            throw new Error(error.message);
          }

          const activity = [...user.data.activity]
            .sort(
              (a, b) =>
                new Date(b.timemark).getTime() - new Date(a.timemark).getTime()
            )
            .slice(0, 9);

          activity.push({
            type: "post",
            msg: `Published a new post`,
            post_title: data[0].title!,
            post_link: data[0].id.toString(),
            timemark: new Date().toISOString(),
          });

          await supabase
            .from("profiles")
            .update({ activity })
            .eq("uid", user.data.uid)
            .select();

          await supabase.auth.updateUser({
            data: {
              activity,
            },
          });
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

          const profiles = (await supabase.from("profiles").select()).data;
          const post = (
            await supabase
              .from("posts")
              .select()
              .eq("id", posts.comments.activePostId)
              .select()
          ).data;

          const data = post![0].comments.map((comment) => {
            const filtered = profiles?.find(
              (profile) => profile.uid === comment.author
            );

            comment.username = filtered?.username;
            comment.avatar = filtered?.avatar;
            comment.link = filtered?.link;

            return comment;
          });

          if (!profiles || !post) {
            throw new Error();
          }

          return {
            activeId: posts.comments.activePostId,
            comments: data,
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
      async (image: string[], { getState, rejectWithValue }) => {
        try {
          const { posts, user } = getState() as {
            posts: IPosts;
            user: IUser;
          };

          const selectedPost = posts.fetchedPosts?.find(
            (p) => p.id === posts.comments.activePostId
          );

          const activity = [...user.data.activity]
            .sort(
              (a, b) =>
                new Date(b.timemark).getTime() - new Date(a.timemark).getTime()
            )
            .slice(0, 9);

          activity.push({
            type: "comment",
            msg: `Commented on`,
            post_title: selectedPost?.title!,
            post_link: selectedPost?.id.toString(),
            timemark: new Date().toISOString(),
          });

          await supabase
            .from("profiles")
            .update({ activity })
            .eq("uid", user.data.uid)
            .select();

          await supabase.auth.updateUser({
            data: {
              activity,
            },
          });

          if (!posts.comments.activePostId) throw new Error();

          const comment: FetchedCommentType = {
            id: self.crypto.randomUUID().toString(),
            author: user.data.uid,
            content: posts.insertComment.content,
            image: image,
            timestamp: new Date().toISOString(),
            likes: 0,
          };

          const comments = posts.comments.activeComments
            ? posts.comments.activeComments.concat(comment)
            : [comment];

          const profiles = (await supabase.from("profiles").select()).data;

          const post = (
            await supabase
              .from("posts")
              .update({
                comments: comments,
              })
              .eq("id", posts.comments.activePostId)
              .select()
          ).data;

          const data = post![0].comments.map((comment) => {
            const filtered = profiles?.find(
              (profile) => profile.uid === comment.author
            );

            comment.username = filtered?.username;
            comment.avatar = filtered?.avatar;
            comment.link = filtered?.link;

            return comment;
          });

          if (!profiles || !post) {
            throw new Error();
          }

          return {
            activeId: posts.comments.activePostId,
            comments: data,
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
