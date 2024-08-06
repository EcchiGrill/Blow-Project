import "./App.css";
import Header from "components/Header/Header";
import Navbar from "components/Navbar/Navbar";
import Profile from "components/Profile/Profile";
import Chats from "components/Chats/Chats";
import Music from "components/Music/Music";
import Settings from "components/Settings/Settings";
import Gallery from "components/Gallery/Gallery";
import { Route, Routes } from "react-router-dom";

const App = (props) => {
  return (
    <div className="app-wrapper">
      <Header />
      <Navbar data={props.state.chatsPage} />
      <div className="app-wrapper-content">
        <Routes>
          <Route
            path="/profile"
            element={<Profile data={props.state.profilePage} />}
          />
          <Route
            path="/chats/*"
            element={<Chats data={props.state.chatsPage} />}
          />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/music" element={<Music />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
