"use client"

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {Toaster, toast} from "react-hot-toast";

export const user_service = "http://13.63.193.155:4000";
export const mail_service = "http://13.63.193.155:4001";
export const chat_service = "http://13.63.193.155:4002";


export interface User{
    _id:string;
    name:string;
    email:string;
    
}

export interface Chat {
    _id:string;
    participants:User[];
    latestMessage:{
        text:string;
        sender:string;
    };
    createdAt:string;
    updatedAt:string;
    unseenCount?:number;
}

export interface Chats{
    _id:string;
    user:User;
    chat:Chat;
}

interface AppContextType{
    user:User | null;
    loading:boolean;
    isAuth:boolean;

    setUser:React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
    logoutUser:()=>Promise<void>;
    chats:Chats[];
    users:User[];
    fetchChats:()=>Promise<void>;
    fetchUsers:()=>Promise<void>;
    setChats:React.Dispatch<React.SetStateAction<Chats[]>>;
    setUsers:React.Dispatch<React.SetStateAction<User[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps{
    children:React.ReactNode;
}

export const AppProvider:React.FC<AppProviderProps> = ({children})=>{
    const [user,setUser] = useState<User | null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const [isAuth,setIsAuth] = useState<boolean>(false);

    async function fetchUser(){
        try {
            setLoading(true);
            const token = Cookies.get("token");
            if(token){
                const response = await fetch(`${user_service}/api/v1/user/me`,{
                    headers:{
                        "Authorization":`Bearer ${token}`
                    }
                });
                const data = await response.json();
                if(data.user){
                    setUser(data.user);
                    
                    setIsAuth(true);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function logoutUser(){
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false);
        toast.success("User logged out successfully");
    }

    
    const [chats,setChats] = useState<Chats[]>([]);
    async function fetchChats(){
        try {
            const token = Cookies.get("token");
            if(token){
                const {data} = await axios.get(`${chat_service}/api/v1/chat/all`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                if(data.chats){
                    // console.log(data.chats);
                    setChats(data.chats);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [users, setUsers] = useState<User[]>([]);
    async function fetchUsers(){
        try {
            const token = Cookies.get("token");
            if(token){
                const {data} = await axios.get(`${user_service}/api/v1/user/all`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                if(data.users){
                    setUsers(data.users);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchChats();
        fetchUsers();
    }, []);

    return (
        <AppContext.Provider value={{user,loading,isAuth,setUser,setIsAuth,setLoading,logoutUser,chats,users,fetchChats,fetchUsers,setChats,setUsers}}>
            {children}
            <Toaster />
        </AppContext.Provider>
    )
}

export const useAppData = ()=>{
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useAppData must be used within AppProvider");
    }
    return context;
}