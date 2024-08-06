import styles from "./Chats.module.css";
import Chat from "components/Chats/Chat/Chat";
import ChatWindow from "components/Chats/ChatWindow/ChatWindow";
import { Route, Routes } from "react-router-dom";

const Chats = (props) => {
  let chatsElements = props.data.chats.map((chat) => {
    return (
      <Chat
        id={chat.usertag}
        username={chat.username}
        avatar={chat.avatar}
        status={chat.status}
      />
    );
  });

  let chatWindowRoutes = props.data.chats.map((chat) => {
    return (
      <Route
        path={`/${chat.usertag}`}
        element={
          <ChatWindow
            usertag={chat.usertag}
            username={chat.username}
            avatar={chat.avatar}
            status={chat.status}
            messages={props.data[`messages-${chat.usertag}`]}
          />
        }
      />
    );
  });

  return (
    <main className={styles.chats}>
      <div className={styles.chatsList}>{chatsElements}</div>
      <Routes>{chatWindowRoutes}</Routes>
    </main>
  );
};

export default Chats;
