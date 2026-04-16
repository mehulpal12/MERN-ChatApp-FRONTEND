import { Chats, User } from '@/context/AppContext';
import { CornerDownRight, CornerUpLeft, LogOut, MessageCircle, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

interface ChatSidebarProps{
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    showAllUsers: boolean;
    setShowAllUsers: (showAllUsers: boolean) => void;
    istyping: boolean;
    typingTimeOut: NodeJS.Timeout | null;
    user: User[] | null;
    chats: Chats[]| null;
    selectedUser: string | null;
    setSelectedUser: (userId: string) => void;
    handlelogout: () => void;
    loggedInUser: User | null;
    createChat: (user:User) => void;
    onlineUsers: string[];
}

const ChatSidebar = ({sidebarOpen, setSidebarOpen, showAllUsers, setShowAllUsers, istyping, typingTimeOut, user, chats, selectedUser, setSelectedUser, handlelogout, loggedInUser, createChat, onlineUsers}: ChatSidebarProps) => {

  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
  <aside className={`fixed z-30 sm:static top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
   {/* Header */}
   <div className='p-2 border-b border-gray-700'>
    {/* <div className="sm:hidden flex justify-end mb-0">
      <button className='text-gray-400 hover:text-white p-2' onClick={() => setSidebarOpen(false)}>
       <X className='w-6 h-6 text-gray-300 hover:text-white'/>
      </button>
    </div> */}
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <div className='rounded-full bg-gray-700 flex items-center justify-center'>
         <MessageCircle className='w-6 h-6 text-gray-300 hover:text-white'/>
        </div>
        <h1 className='text-xl font-bold'>{showAllUsers? "New Chat":"Messages"}</h1>
      </div>
      <button onClick={() => setShowAllUsers(!showAllUsers)} className='text-gray-400 hover:text-white p-2'>
       {showAllUsers ? <X className='w-6 h-6 text-gray-300 hover:text-white'/> : <Plus className='w-6 h-6 text-gray-300 hover:text-white' />}
      </button>
    </div>
   </div>
   {/* content  */}
   <div className="flex-1 overflow-hidden px-4 py-2">
    {
      showAllUsers? (<div className='space-y-4 h-full'>
        <div className="relative">
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
          <input type="text" placeholder='Search Users..' className='w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500' value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        {/* User List */}
        <div className='flex-1 overflow-y-auto space-y-2'>
          {user?.filter((u) => u._id !== loggedInUser?._id && u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
            <div key={u._id} onClick={() => createChat(u)} className='flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer'>
              <div className='relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center'>
                <span className='text-gray-300'>{u.name.charAt(0).toUpperCase()}</span>
                {
                  onlineUsers.includes(u._id) && (
                    <span className='text-xs absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-white bg-green-500 rounded-full border-2 border-gray-900'></span>
                  )
                }
              </div>
              <div className='flex-1'>                
                <h3 className='font-medium'>{u.name}</h3>
                {
                  onlineUsers.includes(u._id) ? <p className='text-sm text-green-500'>Online</p> : <p className='text-sm text-gray-400'>Offline</p>
                }
              </div>
            </div>
          ))}
        </div>
      </div>) : chats && chats.length > 0 ? (<div className='space-y-2'>
        {chats.map((chatItem) => {
          const latestMessage = chatItem.chat.latestMessage;
          const isSelected = selectedUser === chatItem.chat._id;
          const isSendByMe = latestMessage?.sender === loggedInUser?._id;
          const unSeenCount = chatItem.chat.unseenCount;

          
           return <button key={chatItem.chat._id} onClick={()=> {
            setSelectedUser(chatItem.chat._id);
            // setSidebarOpen(false);
           }} className={`w-full text-left p-3 rounded-lg transition-colors ${isSelected ? "bg-gray-700" : "hover:bg-gray-800"}`}>
            <div className='flex items-center gap-3'>
              <div className='relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center'>
                <span className='text-gray-300'>{(chatItem.user?.name || "U").charAt(0).toUpperCase()}</span>
                {
                  chatItem.user && onlineUsers.includes(chatItem.user._id) && (
                    <span className='text-xs absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-white bg-green-500 rounded-full border-2 border-gray-900'></span>
                  )
                }
              </div>
              <div className='flex-1'>
                <div className=" flex justify-between">
                  <h3 className='font-medium'>{chatItem.user?.name || "Unknown User"}</h3>
                {
                  unSeenCount && unSeenCount > 0 && (
                    <span className='text-xs text-white bg-red-500 rounded-full px-2 py-1'>{unSeenCount}</span>
                  )
                }
                </div>
                {
                     latestMessage && <div className='flex items-center gap-2'>
                      {isSendByMe ? <CornerUpLeft  size={14} className='text-blue-500 shrink-0'/>: <CornerDownRight size={14} className='text-green-500 shrink-0' />}
                      <p className='text-sm text-gray-400'>{latestMessage.text}</p>
                     </div>
                }
              </div>
            </div>            
           </button>
        })}
      </div>) 
      : (<div>
        <div className="flex flex-col items-center justify-between h-full text-center">
          <div className="p-4 bg-gray-800 rounded-full flex items-center justify-center mb-4 mt-50">
            <MessageCircle className='w-12 h-12 text-gray-400'/>
          </div>
          <h3 className='text-xl font-medium mb-2'>No Chats Yet</h3>
          <p className='text-gray-400'>Start a conversation by selecting a user</p>
        </div>
      </div>)
    }
   </div>
   {/* footer  */}
   <div className='w-full p-4 border-t border-gray-700 bg-gray-900'>
    {/* user info  */}
    <div className='flex items-center gap-3'>
      
      <Link href="/profile" className='cursor-pointer w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center'>
        <span className='text-gray-300'>{loggedInUser?.name.charAt(0).toUpperCase()}</span>
      </Link>
      <Link href="/profile" className='flex-1 cursor-pointer'>
        <h3 className='font-medium'>{loggedInUser?.name}</h3>
        <p className='text-sm text-gray-400'>{loggedInUser?.email}</p>
      </Link>
      <button onClick={handlelogout} className='text-gray-400 hover:text-white p-2'>
        <LogOut className='w-6 h-6 cursor-pointer text-gray-300 hover:text-white'/>
      </button>
    </div>
   </div>
  </aside>
  )
}

export default ChatSidebar