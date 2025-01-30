import './App.css';
import Login from './component/Login';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from './component/Home';
import HostState from './context/HostState';
import Profile from './component/Profile';
import Expense from './component/Expense';
import Visualization from './component/Visualization';
import Income from './component/Income';
import DownloadReport from './component/DownloadReport';
import SignUp from './component/SignUp';
import Loader from './component/Loader';

function App() {
  return (
    <>
    <HostState>
    <Router>
      <Routes>
        
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/expnese' element={<Expense/>}/>
        <Route path='/visualization' element={<Visualization/>}/>
        <Route path='/income' element={<Income/>}/>
        <Route path='/download' element={<DownloadReport/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </Router>
    </HostState>
   
   
    </>
  );
}

export default App;
