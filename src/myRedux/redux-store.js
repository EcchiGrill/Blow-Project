import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./profileSlice";
import { chatsSlice } from "./chatsSlice";

const store = configureStore({
  reducer: { profilePage: profileSlice.reducer, chatsPage: chatsSlice.reducer },
});

//TODO Добавление перманентного middleware sortFavoriteChats();

window.store = store;
export default store;
