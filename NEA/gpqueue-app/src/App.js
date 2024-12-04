import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {Login, Register} from "./login"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}


