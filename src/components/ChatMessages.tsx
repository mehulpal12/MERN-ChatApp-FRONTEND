import { Message } from '@/app/chat/page'
import { User } from '@/context/AppContext';
import React, { useEffect, useMemo, useRef } from 'react'
import moment from 'moment';
import { Check, CheckCheck } from 'lucide-react';
interface ChatMessagesProps {
    selectedUser: string | null
    messages: Message[] | null;
    loggedInUser: User | null;

}

const ChatMessages = ({selectedUser, messages, loggedInUser}: ChatMessagesProps) => {

    const bottomRef = useRef<HTMLDivElement>(null);
    const uniqueMessages = useMemo(() => {
        if (!messages) return [];
        const seen = new Set();
        return messages.filter((message) => {
            const duplicate = seen.has(message._id);
            seen.add(message._id);
            return !duplicate;
        });
    }, [messages]);
    // seen feature

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [selectedUser, uniqueMessages])

  return (
    <div className='flex-1 overflow-hidden'>
        <div className="h-full max-h-[calc(100vh-215vh)] overflow-y-auto p-2 space-y-2 custom-scroll">
            {
                !selectedUser ? <p className="text-center mt-50 text-gray-500">Select a user to start chatting</p>
                :<>
                {
                    uniqueMessages.map((e,i) => {
                        const isSendByMe = e.sender === loggedInUser?._id;
                        const uniqueKey = `${e._id}-${i}`
                        return (
                            <div key={uniqueKey} className={`flex flex-col ${isSendByMe ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] p-2 rounded-lg ${isSendByMe ? "self-end bg-blue-500" : "self-start bg-gray-500"}`}>
                                   {
                                    e.messageType === 'image' && e.image && (
                                        <div className="relative group">
                                            <img src={e.image.url} alt={e.text} className='rounded-lg max-w-xs' />
                                        </div>
                                    )
                                   }
                                   {e.text && <p className='mt-1'>{e.text}</p>}
                                </div>
                                <div className={`flex items-center mt-1 gap-1 text-xs text-gray-400 ${isSendByMe ? "self-end" : "self-start"}`}>
                                    <span className='whitespace-nowrap'>
                                        {moment(e.createdAt).format("hh:mm A . MMM D")}
                                    </span>
                                    {
                                        isSendByMe && (
                                            <div className={`flex items-center ${e.seen ? "text-blue-500" : "text-gray-400"}`}>
                                                {e.seen ? <div className='flex items-center gap-1'>
                                                     <CheckCheck className='w-4 h-4'/>
                                                </div>
                                                : <Check className='w-4 h-4 text-gray-400'/>}
                                            </div>
                                        ) 
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                <div ref={bottomRef} className=""></div>
                </>
            }
        </div>
    </div>
  )
}

export default ChatMessages