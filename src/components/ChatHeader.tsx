
import { User } from '@/context/AppContext'
import { Menu, UserCircle } from 'lucide-react'
import React from 'react'

interface ChatHeaderProps{
    user : User | null;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isTyping: boolean;
    selectedUser: string | null;
}

const ChatHeader = ({user, setSidebarOpen, isTyping, selectedUser}: ChatHeaderProps) => {
    console.log(user);
    
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
            </div> 
            {/* // user info  */}
            <div>
                <h3 className='font-medium'>{user.name}</h3>
                <p className='text-sm text-gray-400'>{user.email}</p>
            </div>
            {/* show typing status  */}
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