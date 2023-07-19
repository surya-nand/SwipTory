// import StoryForm from "./story";
import "./App.css";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Mainpage from "./components/Mainpage/mainpage";
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import Bookmarkpage from "./components/Bookmarkpage/bookmarkpage";
import Mobileuserpage from "./components/mobileuserpage/mobileuserpage";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Mainpage/>}></Route>
          <Route exact path="/login" element={<Login/>}></Route>
          <Route exact path="/register" element={<Register/>}></Route>
          <Route exact path="/bookmarkpage" element={<Bookmarkpage/>}></Route>
          <Route exact path="/mobilestories" element={<Mobileuserpage/>}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
