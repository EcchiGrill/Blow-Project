import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

let postsData = [
  { id: 1, text: "This is my first post!", likeCount: 5 },
  {
    id: 2,
    text: "No bitches??",
    img: "https://i.pinimg.com/736x/45/7f/5c/457f5c7f1435df48e9c7765eda8c1748.jpg",
    likeCount: 13,
  },
];

let chatsData = [
  { id: 1, username: "Matr1x" },
  { id: 2, username: "Spike Spiegel" },
  { id: 3, username: "John Doe" },
];

let messagesData = [
  { id: 1, text: "Hi John Doe!" },
  { id: 2, text: "Rofls" },
  { id: 3, text: "Fortnite balls" },
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App posts={postsData} chats={chatsData} messages={messagesData} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
