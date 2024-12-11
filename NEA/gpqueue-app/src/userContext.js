import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [cookies, setCookies] = useState({
        type: null,
        name: null,
        id: null
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
