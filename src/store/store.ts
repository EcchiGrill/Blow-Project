import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import postsSlice from "./slices/postsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postsSlice,
  },
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
