import { Paperclip, Plus, X } from 'lucide-react';
import React, {useState} from 'react'
import toast from 'react-hot-toast';

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: (value: string) => void;
  handleMessageSend: (e: any, imageFile?: File | null) => Promise<void>;
}

const MessageInput = ({ selectedUser, message, setMessage, handleMessageSend }: MessageInputProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!message.trim() && !imageFile) return;
        setIsUploading(true);
        await handleMessageSend(e, imageFile);
        setImageFile(null);
        setIsUploading(false);

    };
    if(!selectedUser)return null;
    
    

  return (

    <form onSubmit={handleSubmit} className="flex flex-col border-t border-gray-700 pt-2 gap-2">
        {
            imageFile && <div className='relative w-fit '>
                <img src={URL.createObjectURL(imageFile)} alt="preview" className='w-24 h-24 object-cover rounded-lg border border-gray-600' />
                <button type='button' onClick={() => setImageFile(null)} className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'>
                    <X className='w-4 h-4 text-white'/>
                </button>
            </div>
        }
       <div className='flex gap-2 items-center'>
        <label className='cursor-pointer bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors duration-200 text-gray-300 hover:text-white'>
            <Paperclip className='w-5 h-5'/>
            <input type='file' accept='image/*' onChange={e => {
                const file = e.target.files?.[0];
                if(file && file.type.startsWith("image/")){
                    setImageFile(file);
                }else{
                    toast.error("Please select an image file");
                }
            }
                
            } className='hidden'/>
        </label>
        <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder={imageFile ? "Add a caption" : "Type a message..."} className='flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors duration-200'/>
        <button type='submit' disabled={isUploading} className='bg-blue-500 hover:bg-blue-600 rounded-lg px-3 py-2 transition-colors duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed'>
            {isUploading ? "Sending..." : "Send"}
        </button>
       </div>
    </form>

)
}

export default MessageInput