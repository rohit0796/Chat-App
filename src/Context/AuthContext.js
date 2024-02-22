import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [selectedChat, setSelectedChat] = useState(null);
    const [repeatFetch, setRepeatFetch] = useState(true);
    const [chat, setChat] = useState(null);
    const [mystream, setMystream] = useState();

    return (
        <AuthContext.Provider value={{
            currentUser,
            setCurrentUser,
            selectedChat,
            setSelectedChat,
            chat,
            setChat,
            repeatFetch,
            setRepeatFetch,
            mystream,
            setMystream
        }}>
            {children}
        </AuthContext.Provider>
    )
}