import React, { createContext, useContext, useState } from "react";
import Stack from "./stack";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [cookies, setCookies] = useState({
        type: null,
        name: null,
        id: null,
        prevPageStack: [],
        currentPage: null,
        backUsed : false,
    });

    return (
        <UserContext.Provider value={{ cookies, setCookies }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => useContext(UserContext);

export function checkAuthentication() {
    console.log('aaaaaaaaa')
}
