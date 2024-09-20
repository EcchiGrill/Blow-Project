import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  posts: [
    { id: 1, text: "This is my first post!", likeCount: 5 },
    {
      id: 2,
      text: "No bitches??",
      img: "https://i.pinimg.com/736x/45/7f/5c/457f5c7f1435df48e9c7765eda8c1748.jpg",
      likeCount: 13,
    },
  ],
  newPostText: "",
};

export const profileSlice = createSlice({
  name: "profilePage",
  initialState,
  reducers: {
    addPost: (state) => {
      let postIds = [];

      state.posts.map((post) => {
        return postIds.push(post.id);
      });

      let maxPostId = Math.max(...postIds);

      let post = {
        id: ++maxPostId,
        text: state.newPostText,
        img: "",
        likeCount: 0,
      };
      state.posts.push(post);
      state.newPostText = "";
    },
    updateNewPostText: (state, action) => {
      state.newPostText = action.text;
    },
  },
});

export const { addPost, updateNewPostText } = profileSlice.actions;
