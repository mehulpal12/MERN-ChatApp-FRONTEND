"use client"
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, {useEffect} from 'react'

const VeriftyOtp = () => {
    const [loading, setLoading] = React.useState<boolean>(false);

    const searchParams = useSearchParams();
    const email:string | null = searchParams.get("email") || "";

    const [otp, setOtp] = React.useState<string[]>(["","","","","","",""]);
    const [error, setError] = React.useState<string>("");
    const [resendLoading, setResendLoading] = React.useState<boolean>(false);
    const [timer, setTimer] = React.useState<number>(60);
    const inputrefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent<HTMLElement>):Promise<void> => {
        e.preventDefault();
        setLoading(true);
        
      };

      useEffect(() => {
        if(!email){
            router.push("/login");
        }
        if(timer > 0){
            const timerId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
      }, [timer])

    const handleInputChange = (index:number, value:string):void => {
        if(value.length > 1){
            return;
        }
        if(value === ""){
            inputrefs.current[index]?.focus();
        }else{
            inputrefs.current[index + 1]?.focus();
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");
        if(value && index < 6){
            inputrefs.current[index + 1]?.focus();
        }
    }      

    const handleKeyDown = (index:number, e:React.KeyboardEvent<HTMLInputElement>):void => {
        if(e.key === "Backspace" && !otp[index] && index > 0){
            inputrefs.current[index - 1]?.focus();
        }
    }

    const handlePaste = (e:React.ClipboardEvent<HTMLInputElement>):void => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0,6).split("");
        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if(index < 6){
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
        setError("");
        if(pastedData.length < 6){
            inputrefs.current[pastedData.length]?.focus();
        }
    }
    
  return (
    <div>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-700 p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Lock size={40} color="white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Verify Your Email
            </h1>
            <p className="text-gray-300 text-lg">
              Enter your OTP to continue your journey OTP is sended to your email address
            </p>
            <p className="text-gray-300 text-lg">{email}</p>
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
                //   value={email}
                //   onChange={(e)=>setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white  py-4 px-6 rounded-lg transition-colors font-semibold disabled:opacity-50   disabled:cursor-not-allowed mt-2" 
              disabled={loading}
              >
                {
                  loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span> Verify Code</span>
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
    </div>
  )
}

export default VeriftyOtp