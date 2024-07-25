import './App.css';
import Header from 'components/Header/Header';
import Navbar from 'components/Navbar/Navbar';
import Profile from 'components/Profile/Profile';
import Chats from 'components/Chats/Chats';


const App = () => {
  return (
    <div className='app-wrapper'>
        <Header />
        <Navbar />
      <div className='app-wrapper-content'>
        <Chats />
      </div>
    </div>
  );
}

export default App