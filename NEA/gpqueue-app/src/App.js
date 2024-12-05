import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {Login, Register} from "./login"
import { Homepage } from './home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </Router>
  );
}


