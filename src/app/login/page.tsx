"use client"
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  
  const handleSubmit = async(e: React.FormEvent<HTMLElement>):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const {data} = await axios.post("http://localhost:4000/api/v1/user/login",{email})
      console.log(data);
      alert(data.message)
      router.push(`/verify?email=${email}`)
    } catch (error:any) {
      alert(error)
    }finally{
        setLoading(false);
    }
    console.log(email);
  };
  // 3:49:51
  return ( 
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-700 p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Mail size={40} color="white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome To Chat-App
            </h1>
            <p className="text-gray-300 text-lg">
              Enter your Email to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white  py-4 px-6 rounded-lg transition-colors font-semibold disabled:opacity-50   disabled:cursor-not-allowed mt-2" 
              disabled={loading}
              >
                {
                  loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span> Send Verification Code</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
