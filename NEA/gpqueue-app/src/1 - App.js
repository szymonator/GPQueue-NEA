import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./userContext";
import {Login, Register, StaffApproval} from "./3 - login"
import { Homepage } from './2 - home';
import { AppointmentsHome, BookAppointment1, BookAppointment2 } from './5 - appointments';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/staffApproval" element={<StaffApproval />} />
          <Route path="/appointments" element={<AppointmentsHome />} />
          <Route path="/BookAppointment1" element={<BookAppointment1 />} />
          <Route path="/BookAppointment2" element={<BookAppointment2 />} />


        </Routes>
      </Router>
    </UserProvider>
  );
}


