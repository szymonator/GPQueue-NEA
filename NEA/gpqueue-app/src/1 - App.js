import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CookiesProvider, BookingProvider } from "./userContexts";
import {Login, Register, StaffApproval} from "./3 - login"
import { PatientHome, StaffHome, FutureAppts, PastAppts } from './2 - home';
import {BookAppointment1, BookAppointment2, BookAppointment3, BookAppointment4, Timeout } from './5 - appointments';

export default function App() {
  return (
    <CookiesProvider>
      <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/null" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staffApproval" element={<StaffApproval />} />
          <Route path="/home" element={<PatientHome />} />
          <Route path="/StaffHome" element={<StaffHome />} />
          <Route path="/BookAppointment1" element={<BookAppointment1 />} />
          <Route path="/BookAppointment2" element={<BookAppointment2 />} />
          <Route path="/BookAppointment3" element={<BookAppointment3 />} />
          <Route path="/BookAppointment4" element={<BookAppointment4 />} />
          <Route path="/FutureAppointments" element={<FutureAppts />} />
          <Route path="/PastAppointments" element={<PastAppts />} />
          <Route path="/timeout" element={<Timeout />} />

        </Routes>
      </Router>
      </BookingProvider>
    </CookiesProvider>
  );
}


