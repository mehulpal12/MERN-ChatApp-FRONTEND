"use client"
import { useAppData, user_service } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from '@/components/Loading'
import { ArrowLeftIcon, UserCircle } from 'lucide-react'

const ProfilePage = () => {
  const {user , isAuth,loading, setUser} = useAppData()
  const [isEdit, setIsEdit] = useState(false)
  const [name, setName] = useState<string | undefined>("")

  const router = useRouter()

  const editHandler = () => {
    setIsEdit(!isEdit)
    setName(user?.name)
  }

  const submitHandler = async (e:React.FormEvent) => {
    e.preventDefault()
    const token = Cookies.get("token")
    try {
      const {data} = await axios.post(`${user_service}/api/v1/user/update`,{name},{
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      })

      Cookies.set("token",data.token, {
        expires:15,
        secure:false,
        path:"/"
      })
      toast.success("Name updated successfully")
      setUser(data.user)
      setIsEdit(false)
    } catch (error:any) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if(!isAuth && !loading) router.push("/login")
  }, [isAuth,loading,router])

  if(loading) return <div><Loading/></div>

    return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='max-w-2xl mx-auto pt-8'>
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/chat")} className='bg-gray-800 flex items-center gap-2 hover:bg-gray-700 text-white px-4 py-2 rounded-lg'>
            <ArrowLeftIcon/>
            Back
          </button>
          <div className="">
            <h1 className='text-3xl font-bold text-white'>Profile settings</h1>
            <p className='text-gray-400'>Manage your account settings</p>
            
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
          <div className="bg-gray-700 p-4 rounded-lg border-gray-600 ">
            <div className="flex items-center gap-6">
              <div className="relative">
               <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                <UserCircle className='w-10 h-10 text-gray-400'/>
               </div>
               <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex-1">
                <h2 className='text-2xl font-semibold text-white mb-1'>{user?.name || "User"}</h2>
                <p className='text-gray-400'>Active Now </p>

              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div className="">
                <label className='block text-sm font-semibold text-gray-300 mb-3 '>
                  Display Name 
                </label>
                {
                  isEdit ? (
                    <form onSubmit={submitHandler} className="flex gap-3">
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500" />
                      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Update</button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{user?.name || "User"}</span>
                      <button onClick={() => setIsEdit(true)} className="text-blue-500 hover:text-blue-600">Edit</button>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          
        </div>
        
      </div>

      
    </div>
  )
}

export default ProfilePage 