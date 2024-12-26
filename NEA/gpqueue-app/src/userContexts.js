import React, { createContext, useContext, useState } from "react";

const CookiesContext = createContext();
const BookingContext = createContext();


export const CookiesProvider = ({ children }) => {
    const [cookies, setCookies] = useState({
        type: null,
        name: null,
        id: null,
        prevPageStack: [],
        currentPage: null,
        backUsed : false,
    });

    return (
        <CookiesContext.Provider value={{ cookies, setCookies }}>
            {children}
        </CookiesContext.Provider>
    );
};

export const BookingProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState({
        priority: null,
        reason: '',
        dates: '',
        times: '',
    });

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingContext.Provider>
    );
};


export const useCookies = () => useContext(CookiesContext);
export const useBooking = () => useContext(BookingContext)