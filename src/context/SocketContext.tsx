"use client"

import { Socket, io } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { chat_service, useAppData } from "./AppContext";

interface SocketContextType{
    socket: Socket | null;
    onlineUsers: string[];
}

export const SocketContext = createContext<SocketContextType>({
    socket:null,
    onlineUsers: [],
});

interface ProviderProps{
    children:React.ReactNode;
}

export const SocketProvider = ({children}:ProviderProps) => {
    const [socket,setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const {user} = useAppData()
    

    useEffect(()=>{
        if(!user?._id) return;

        const newSocket = io(chat_service,{
            query:{
                userId:user._id
            }
        })

        setSocket(newSocket)

        newSocket.on("getOnlineUsers",(users:string[]) => {
            setOnlineUsers(users)
        })

        return () =>{ newSocket.disconnect()}
    },[user?._id])
    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    );
}

export const SocketData = () => useContext(SocketContext)