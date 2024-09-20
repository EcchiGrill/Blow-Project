const ADD_POST = "ADD-POST";
const UPDATE_NEW_POST_TEXT = "UPDATE-NEW-POST-TEXT";

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

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
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
      return state;

    case UPDATE_NEW_POST_TEXT:
      state.newPostText = action.text;
      return state;

    default:
      return state;
  }
};

export const addPostActionCreator = () => {
  return { type: ADD_POST };
};

export const updateNewPostTextActionCreator = (value) => {
  return { type: UPDATE_NEW_POST_TEXT, text: value };
};

export default profileReducer;
