
import { User } from '@/context/AppContext'
import { Menu, UserCircle } from 'lucide-react'
import React from 'react'

interface ChatHeaderProps{
    user : User | null;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isTyping: boolean;
    selectedUser: string | null;
    onlineUsers: string[];
}

const ChatHeader = ({user, setSidebarOpen, isTyping, selectedUser, onlineUsers}: ChatHeaderProps) => {
  const isOnline = user && onlineUsers.includes(user._id)
    // console.log(user);
    
  return<>
  {/* mobile toggle button  */}
  <div className='sm:hidden  fixed top-4 right-4 z-30'>
    <button className='text-gray-400 hover:text-white p-2' onClick={() => setSidebarOpen(prev => !prev)}>
      <Menu className='w-6 h-6 text-gray-300 hover:text-white'/>
    </button>
  </div>

  {/* header content  */}
  <div className='p-4 border-gray-700 '>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-3'>
         {
            user ? <>
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className='text-gray-300 text-lg'>{user.name.charAt(0).toUpperCase()}</span>
                </div>
                {/* yaha pe online dot dikhana hai  */}
                {
                  isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900">
                      <span className='absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75'></span>
                    </div>
                  )
                }

            </div> 
            {/* // user info  */}
            <div>
                <h3 className='font-medium'>{user.name}</h3>
                <div className="flex items-center gap-2">
              {
                isTyping ? <div className='flex items-center gap-2 text-sm text-gray-400'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay:"0.1s"}}></div>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{animationDelay:"0.2s"}}></div>
                <span className='text-sm text-gray-400'>typing...</span>
                </div> : <div className='flex items-center gap-2 text-sm text-gray-400'>
                  {
                    isOnline ? <div className='w-2 h-2 bg-green-500 rounded-full'></div> : <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                  }
                  <span className='text-sm text-gray-400'>{isOnline ? "Online" : "Offline"}</span>

                </div>
              }
            </div>
            </div>
            
            </>
            
            
            : <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <UserCircle className='w-10 h-10 text-gray-300 hover:text-white'/>
              </div>
              <div className="flex-1">
                <h3 className='font-medium'>select a conversation</h3>
                <p className='text-sm text-gray-400'>choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
         }
        </div>
        
      </div>
    </div>
  </div>
  </>
}

export default ChatHeader