import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  addPost,
  sendMessage,
  updateNewMessageText,
  updateNewPostText,
} from "redux/state";

const root = ReactDOM.createRoot(document.getElementById("root"));

export let renderTree = (state) => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App
          state={state}
          addPost={addPost}
          sendMessage={sendMessage}
          updateNewPostText={updateNewPostText}
          updateNewMessageText={updateNewMessageText}
        />
      </BrowserRouter>
    </React.StrictMode>
  );
};
