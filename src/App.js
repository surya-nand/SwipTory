import "./App.css";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import Mainpage from "./components/Mainpage/mainpage";
import Bookmark from "./components/Bookmarks/bookmark";
import MobUserStory from "./components/mobileuserstories/mobuserstory";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Mainpage/>}></Route>
          <Route exact path="/login" element={<Login/>}></Route>
          <Route exact path="/register" element={<Register/>}></Route>
          <Route exact path="/bookmarkpage" element={<Bookmark/>}></Route>
          <Route exact path="/mobilestories" element={<MobUserStory/>}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
