import './App.css';
import Login from './Components/Login/login';
import Home from './Components/Home/Home';
import Memberdashboard from './Components/Memberdashboard/memberdashboard';
import Trainerdashboard from './Components/Trainerdashboard/trainerdashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemberSignup from './Components/Signup/MemberSignup';
import TrainerSignup from './Components/Signup/TrainerSignup';
import Planspage from './Components/Planspage/planspage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/member-signup" element={<MemberSignup />} />
        <Route path="/trainer-signup" element={<TrainerSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/memberdashboard" element={<Memberdashboard />} />
        <Route path="/trainerdashboard" element={<Trainerdashboard />} />
        <Route path="/planspage" element={<Planspage />} />
      </Routes>
    </Router>
  );
}

export default App;