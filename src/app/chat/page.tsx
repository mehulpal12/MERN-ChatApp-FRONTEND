"use client";

import { User, chat_service, useAppData } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/chatSidebar";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";

export interface Message {
  _id: string;
  text?: string;
  sender: string;
  chatId: string;
  image?: {
    public_id: string;
    url: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt: string;
  createdAt: string;
}

const ChatApp = () => {
  const {
    loading,
    isAuth,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    fetchUsers,
    setChats,
    setUsers,
  } = useAppData();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  const [istyping, setIsTyping] = useState<boolean>(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, loading, router]);

  const handlelogout = () => {
    logoutUser();
  };

  async function fetchChat() {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }
      const { data } = await axios.get(
        `${chat_service}/api/v1/chat/message/${selectedUser}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessages(data.messages);
      setUser(data.user);
      await fetchChats();
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
      toast.error("Failed to fetch message");
    }
  }

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }
      const { data } = await axios.post(
        `${chat_service}/api/v1/chat/new`,
        { userId: loggedInUser?._id, otherUserId: u._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSelectedUser(data.chatId);
      setShowAllUsers(false);
      await fetchChats();
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
      toast.error("Failed to create chat");
    }
  }

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
    }
  }, [selectedUser]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden flex relative">
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUsers}
        setShowAllUsers={setShowAllUsers}
        istyping={istyping}
        typingTimeOut={typingTimeOut}
        user={users}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handlelogout={handlelogout}
        loggedInUser={loggedInUser}
        createChat={createChat}
      />
      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-2 border-white/10 rounded-lg">
        <ChatHeader
          user={user}
          setSidebarOpen={setSidebarOpen}
          isTyping={istyping}
          selectedUser={selectedUser}
        />

        <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser} />
      </div>
    </div>
  );
};

export default ChatApp;
