import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./slices/posts-slice";
import userSlice from "./slices/user-slice";
import profileSlice from "./slices/profile-slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postsSlice,
    profile: profileSlice,
  },
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

// window.state = store.getState;
