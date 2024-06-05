import { createContext, useContext, useEffect, useState } from "react";
import {useAuthContext} from './AuthContext'
import io from 'socket.io-client';

export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser}= useAuthContext();
    const SERVER_BASE_URL= import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        if (authUser) {
            const socket = io(SERVER_BASE_URL, {
                query: { 
                    userId: authUser.user._id 
                },
                withCredentials: true
            });
            setSocket((val)=> socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers((val)=> users);
            });

            return () => socket.close();
        }
        else{ // close existing socket connection
            if(socket){
                socket.close();
                setSocket((val)=> null);
            }
        }
    }, [authUser])

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
}
