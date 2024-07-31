import './App.css';
import Header from 'components/Header/Header';
import Navbar from 'components/Navbar/Navbar';
import Profile from 'components/Profile/Profile';
import Chats from 'components/Chats/Chats';
import Music from 'components/Music/Music';
import Settings from 'components/Settings/Settings';
import Gallery from 'components/Gallery/Gallery';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


const App = () => {
  return (
    <BrowserRouter>
    <div className='app-wrapper'>
        <Header />
        <Navbar />
      <div className='app-wrapper-content'>
        <Routes>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/chats/*' element={<Chats />}/>
          <Route path='/gallery' element={<Gallery />}/>
          <Route path='/music' element={<Music />}/>
          <Route path='/settings' element={<Settings />}/>
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App